const Discord = require('discord.js')
const db = require("../db/db.js");

let Reg = db.loadRegHelper(),
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
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    const member = msg.mentions.members.first()
    if (!member) return msg.channel.send("Debes mencionar a un bot para ser aprobado.");
    if (member.user.bot === false) return msg.channel.send("No puedes aprobar a personas *humanas*");
    var dbBot = await BotStorage_[member.user.id];
    let getOwner = bot.users.get(dbBot.owner.id)
    getOwner.send({"embed": {
        "color": 302176,
        "timestamp": new Date,
        "footer": {
            "text": "Equipo de Aprobación de Aplicaciones"
        },
        "thumbnail": {
            "url": member.user.displayAvatarURL
        },
        "image": {
            "url": "https://i.imgur.com/D56tkxB.png"
        },
        "fields": [
        {
            "name": ":white_check_mark: ¡"+member.user.tag+" fue aprobado por el Equipo!",
            "value": "Su Bot ahora es parte de **"+member.guild.name+"** y miembro del **Club de Bots**. Visite el canal <#606230765814153241> y utilice el comando `s/infobot "+member.user.username+"` para obtener información sobre su membresía."
        }
        ]
    }
    })
    let embed = {
        "title": "¡Nuevo Bot: "+member.user.tag+"!",
        "description": "**◈ Prefix:** "+dbBot.config.prefix+"\n**◈ Owner** "+getOwner.tag,
        "color": 109494,
        "timestamp": new Date(),
        "footer": {
            "text": member.guild.name
        },
        "image": {
            "url": member.user.displayAvatarURL
        }
    };
    BotStorage_[member.user.id].data.appr.isAprr = true;
    BotStorage_[member.user.id].data.appr.isQueued = false;
    BotStorage_[member.user.id].data.appr.day = Date.now();
    Reg.save("BotStorage_", JSON.stringify(BotStorage_));

    let channelBotPlay = bot.channels.get("606230765814153241")
    channelBotPlay.send({ embed })
    member.removeRole(member.guild.roles.find(r => r.name === "ToTest"));
    member.addRole(member.guild.roles.find(r => r.name === "Club de Bots"));
    Global[msg.guild.id].q -= 1;
    Reg.save("Global", JSON.stringify(Global));
    Object.keys(BotStorage_).forEach(x => {
        BotStorage_[x].data.appr.nQueue -= 1
    });
    msg.channel.send("El bot fue aceptado.")
};