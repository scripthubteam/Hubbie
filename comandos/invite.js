const botSchema = require("../models/botSchema")
const queueSchema = require("../models/queueSchema")

const {
  inviteChan,
  staffBotReqChan
} = require("../chans.json")

exports.run = async (bot, msg, args) => {

  if (msg.channel.id !== inviteChan) {
    return;
  }


  if (isNaN(args[0])) {
    msg.channel.send(":x: **Esa no es una ID válida.** La ID debe contener el número del cliente de la apliación/usuario.");
    return;
  }

  let user = await bot.fetchUser(args[0])
  let dbBot = await botSchema.findOne({
    botId: user.id
  });

  if (args[0] === bot.user.id) {
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


  if (!user.bot) {
    msg.channel.send(":x: **La ID introducida no pertenece a un Bot**.")
    return;
  }


  if (dbBot !== null) {
    if (dbBot.isAppr && dbBot.ownerId === msg.author.id) {
      msg.channel.send(":x: **Este bot ya está aprobado.** Y es de tu propiedad, ¿sucede algo?");
      return;
    }

    if (dbBot.isQueued && dbBot.ownerId === msg.author.id) {
      msg.channel.send(":x: **Este bot está en la cola de espera. Número: `" + dbBot.nQueue + "`**");
      return;
    }
  }

  if (dbBot === null) {
    dbBot = await botSchema.create({
      botId: user.id,
      requested: Date.now(),
      isAppr: false,
      isQueued: true,
      nQueue: 0,
      day: 0,
      ownerId: msg.author.id,
      prefix: args[1],
      info: "Beep boop, beep?",
      certified: false,
      votes_plus: 0,
      votes_negative: 0,
      vote_players: []
    })
  }

  let queueDb = await queueSchema.findOne({
    serverId: msg.guild.id
  })

  if (queueDb === undefined || queueDb === null) {
    await queueSchema.create({
      serverId: msg.guild.id,
      globalQueued: 0
    })
    queueDb = await queueSchema.findOne({
      serverId: msg.guild.id
    })
  };


  await queueSchema.findOneAndUpdate({
    serverId: msg.guild.id
  }, {
    globalQueued: queueDb.globalQueued + 1
  })

  let count = await queueSchema.findOne({
    serverId: msg.guild.id
  })

  await botSchema.findOneAndUpdate({
    botId: user.id
  }, {
    nQueue: count.globalQueued
  })

  const embed_dm = {
    "embed": {
      "color": msg.member.roles.first().color,
      "timestamp": new Date,
      "footer": {
        "text": "Equipo de Aprobación de Aplicaciones"
      },
      "image": {
        "url": "https://i.imgur.com/D56tkxB.png"
      },
      "fields": [{
        "name": "Su solicitud está pendiente de aprobación.",
        "value": "Le notificamos que su solicitud fue hecha el día **" + new Date + "** y está pendiente de aprobarse o ser rechazada a la brevedad. Su puesto en la cola de espera: `" + dbBot.nQueue + "` ¡Sea paciente!"
      }]
    }
  }

  const embed_staffinv = {
    "content": ":information_source: Para rechazar una solicitud, utilice `s!denegar <ID>`",
    "embed": {
      "title": "Solicitud de invitación",
      "description": "El usuario **" + msg.author.tag + "** ha solicitado que su bot **" + user.tag + "** sea invitado a **Script Hub**",
      "color": msg.member.roles.first().color,
      "timestamp": new Date(),
      "footer": {
        "icon_url": msg.author.displayAvatarURL,
        "text": "Detalles de la petición"
      },
      "thumbnail": {
        "url": user.displayAvatarURL
      },
      "fields": [{
          "name": "🤖 Bot",
          "value": user.tag + " [INVITAR](https://discordapp.com/api/oauth2/authorize?client_id=" + args[0] + "&permissions=104187968&scope=bot&guild_id=606199542605414428) - `ID: " + user.id + "`",
          "inline": true
        },
        {
          "name": "ℹ Prefix",
          "value": "`" + args[1] + "`",
          "inline": true
        },
        {
          "name": "💻 Desarrollador",
          "value": msg.author.tag + " `(Cuenta creada: " + new Date(msg.author.createdTimestamp) + ")`",
          "inline": true
        }
      ]
    }
  }
  const embed_botinv = {
    "embed": {
      "title": "Solicitud de invitación",
      "description": "¡Hola **" + msg.author.tag + "**! Gracias por invitar tu bot a **Script Hub**, este será en lo más breve posible introducido al servidor si cumple los requisitos. Te enviaremos una notificación cuando se decida sobre tu solicitud.",
      "color": msg.member.roles.first().color,
      "timestamp": new Date(),
      "footer": {
        "icon_url": msg.author.displayAvatarURL,
        "text": "Petición generada"
      },
      "thumbnail": {
        "url": user.displayAvatarURL
      },
      "fields": [{
          "name": "🤖 Bot",
          "value": user.tag,
          "inline": true
        },
        {
          "name": "ℹ Prefix",
          "value": "`" + args[1] + "`",
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

  bot.channels.get(inviteChan).send(embed_botinv)
  msg.author.send(embed_dm)
  bot.channels.get(staffBotReqChan).send(embed_staffinv)
};