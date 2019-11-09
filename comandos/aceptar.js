const chan = require("../chans.json")
const botSchema = require("../models/botSchema")
const globalDb = require("../models/queueSchema")

exports.run = async (bot, msg, args) => {
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    const member = msg.mentions.members.first()
    if (!member) return msg.channel.send("Debes mencionar a un bot para ser aprobado.");
    if (member.user.bot === false) return msg.channel.send("No puedes aprobar a personas *humanas*");
    let dbBot = await botSchema.findOne({
        botId: member.user.id
    });

    let getOwner = bot.users.get(dbBot.ownerId)
    getOwner.send({
        "embed": {
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
            "fields": [{
                "name": ":white_check_mark: ¡" + member.user.tag + " fue aprobado por el Equipo!",
                "value": "Su Bot ahora es parte de **" + member.guild.name + "** y miembro del **Club de Bots**. Visite el canal <#606230765814153241> y utilice el comando `s/infobot " + member.user.username + "` para obtener información sobre su membresía."
            }]
        }
    })
    let embed = {
        "title": "¡Nuevo Bot: " + member.user.tag + "!",
        "description": "**◈ Prefix:** " + dbBot.prefix + "\n**◈ Owner** " + getOwner.tag,
        "color": 109494,
        "timestamp": new Date(),
        "footer": {
            "text": member.guild.name
        },
        "image": {
            "url": member.user.displayAvatarURL
        }
    };

    await botSchema.findOneAndUpdate({
        botId: member.user.id
    }, {
        isAppr: true,
        isQueued: false,
        day: Date.now()
    })

    dbBot = await botSchema.find({
        botId: member.user.id
    });

    let global = await globalDb.findOne({
        serverId: msg.guild.id
    })

    let channelBotPlay = bot.channels.get(chan.playgroundBotChan)
    channelBotPlay.send({
        embed
    })
    member.removeRole(member.guild.roles.find(r => r.name === "ToTest"));
    member.addRole(member.guild.roles.find(r => r.name === "Club de Bots"));

    await globalDb.findOneAndUpdate({
        serverId: global.serverId
    }, {
        globalQueued: global.globalQueued - 1
    })

    let bots = await botSchema.find({})
    bots.forEach(async e => {
        await botSchema.findOneAndUpdate({
            botId: e.botId
        }, {
            nQueue: e.nQueue - 1
        })
    })
    msg.channel.send("El bot fue aceptado.")
};