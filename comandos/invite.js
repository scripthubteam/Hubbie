const Discord = require("discord.js");
const db = require("../db/db.js");
db.loadRegHelper();
var Reg,
    BotStorage_,
    Global;

Reg.init("BotStorage_", "{}");

if (typeof BotStorage_ == 'undefined') {
    BotStorage_ = {};
    try {
        BotStorage_ = JSON.parse(Reg.get("BotStorage_"));
    } catch (e) {
        BotStorage_ = {};
    }
}

Reg.init("Global", "{}");

if (typeof Global == 'undefined') {
    Global = {};
    try {
        Global = JSON.parse(Reg.get("Global"));
    } catch (e) {
        Global = {};
    }
}

exports.run = async (bot, msg, args) => {

    if (msg.channel.id !== "616806652619915320") {
        return;
    }

    if (isNaN(args[0])) {
        msg.channel.send(":x: **Esa no es una ID válida.** La ID debe contener el número del cliente de la apliación/usuario.");
        return;
    }

    if(args[0] === bot.user.id){
        msg.channel.send({
          content: "Sí, claro.",
          files: ["https://i.kym-cdn.com/photos/images/original/001/044/374/2f0.png"]
        })
        return;
      }
    
    if (!args[1]) {
        msg.channel.send(":x: **Por favor, especifica un prefix para tu bot.** El prefix ayudará a saber cómo se ejecuta tu bot.");
        return;
    }

    var user = await bot.fetchUser(args[0]);

    if(!user.bot){
        msg.channel.send(":x: **La ID introducida no pertenece a un Bot**.")
        return;
    }

    var dbBot = await BotStorage_[user.id];

    if (dbBot !== undefined) {
        if(dbBot.data.appr.isAppr === true && dbBot.owner.id === msg.author.id){
            msg.channel.send(":x: **Este bot ya está aprobado.** Y es de tu propiedad, ¿sucede algo?");
            return;
        }

        if (dbBot.data.appr.isQueued === true && dbBot.owner.id === msg.author.id) {
            msg.channel.send(":x: **Este bot está en la cola de espera. Número: `"+BotStorage_[user.id].data.appr.nQueue+"`**");
            return;
        }
    }

    if (!BotStorage_[user.id]) BotStorage_[user.id] = {
      "data": {
        "id": user.id,
        "request": {
          "day": Date.now()
        },
        "appr": {
          "isAppr": false,
          "isQueued": true,
          "nQueue": 0,
          "day": 0
        }
      },
      "owner": {
        "id": msg.author.id
      },
     "config": {
        "prefix": args[1],
        "info": "Beep boop, beep?",
        "certified": false,
        "votes_plus": 0,
        "votes_negative": 0,
        "vote_players": []
      }
    }
    if (!Global[msg.guild.id]) Global[msg.guild.id] = { q: 0 };
    Reg.save("Global", JSON.stringify(Global));

    var count = Global[msg.guild.id].q += 1;
    Reg.save("Global", JSON.stringify(Global));
    BotStorage_[user.id].data.appr.nQueue += Number(count)
    Reg.save("BotStorage_", JSON.stringify(BotStorage_));

    const embed_dm = {"embed": {
        "color": msg.member.roles.first().color,
        "timestamp": new Date,
        "footer": {
          "text": "Equipo de Aprobación de Aplicaciones"
        },
        "image": {
          "url": "https://i.imgur.com/D56tkxB.png"
        },
        "fields": [
          {
            "name": "Su solicitud está pendiente de aprobación.",
            "value": "Le notificamos que su solicitud fue hecha el día **"+new Date+"** y está pendiente de aprobarse o ser rechazada a la brevedad. Su puesto en la cola de espera: `"+BotStorage_[user.id].data.appr.nQueue+"` ¡Sea paciente!"
          }
        ]
      }
    }

    const embed_staffinv = {
      "content": ":information_source: Para rechazar una solicitud, utilice `s!denegar <ID>`",
      "embed": {
        "title": "Solicitud de invitación",
        "description": "El usuario **"+msg.author.tag+"** ha solicitado que su bot **"+user.tag+"** sea invitado a **Script Hub**",
        "color": msg.member.roles.first().color,
        "timestamp": new Date(),
        "footer": {
          "icon_url": msg.author.displayAvatarURL,
          "text": "Detalles de la petición"
        },
        "thumbnail": {
          "url": user.displayAvatarURL
        },
        "fields": [
          {
            "name": "🤖 Bot",
            "value": user.tag+ " [INVITAR](https://discordapp.com/api/oauth2/authorize?client_id="+args[0]+"&permissions=104187968&scope=bot&guild_id=606199542605414428) - `ID: "+user.id+"`",
            "inline": true
          },
          {
            "name": "ℹ Prefix",
            "value": "`"+args[1]+"`",
            "inline": true
          },
          {
            "name": "💻 Desarrollador",
            "value": msg.author.tag+" `(Cuenta creada: "+new Date(msg.author.createdTimestamp)+")`",
            "inline": true
          }
        ]
      }
    }
    const embed_botinv = {"embed": {
      "title": "Solicitud de invitación",
      "description": "¡Hola **"+msg.author.tag+"**! Gracias por invitar tu bot a **Script Hub**, este será en lo más breve posible introducido al servidor si cumple los requisitos. Te enviaremos una notificación cuando se decida sobre tu solicitud.",
      "color": msg.member.roles.first().color,
      "timestamp": new Date(),
      "footer": {
        "icon_url": msg.author.displayAvatarURL,
        "text": "Petición generada"
      },
      "thumbnail": {
        "url": user.displayAvatarURL
      },
      "fields": [
        {
          "name": "🤖 Bot",
          "value": user.tag,
          "inline": true
        },
        {
          "name": "ℹ Prefix",
          "value": "`"+args[1]+"`",
          "inline": true
        },
        {
          "name": "💻 Desarrollador",
          "value": msg.author.tag,
          "inline": true
        }
      ]
    }
    }

    bot.channels.get("616806652619915320").send(embed_botinv)
    msg.author.send(embed_dm)
    bot.channels.get("632974065711448074").send(embed_staffinv)
};