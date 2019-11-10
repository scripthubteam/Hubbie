const db = require("../db/db.js")
const botSchema = require("../models/botSchema")

const {
    logChan,
    playgroundBotChan
} = require("../chans.json")

module.exports = async (bot, member) => {
    let channelBot = bot.channels.get(playgroundBotChan) //#playground
    let channelLogHub = bot.channels.get(logChan) //#loghub
    var dbBot = await botSchema.findOne({
        botId: member.user.id
    });

    if (member.user.bot) {
        if (dbBot) {
            let getOwner = bot.users.get(dbBot.ownerId)

            getOwner.send({
                "embed": {
                    "color": 302176,
                    "timestamp": new Date,
                    "footer": {
                        "text": "Equipo de Aprobación de Aplicaciones"
                    },
                    "image": {
                        "url": "https://i.imgur.com/D56tkxB.png"
                    },
                    "fields": [{
                        "name": ":x: Su Bot fue expulsado de Script Hub.",
                        "value": "¿Esto es un error? Contacte a un Administrador."
                    }]
                }
            })
            await botSchema.findOneAndRemove({
                botId: member.user.id
            })
            channelBot.send(":robot: El bot **" + member.user.username + "#" + member.user.discriminator + "** no pertenece más al **Club de Bots**.")
            channelLogHub.send(":robot: [CLUB DE BOTS] **" + member.user.username + "** salió del servidor por no formar parte del **Club de Bots.**")
            return;
        }
        //

        channelLogHub.send(":robot: [COMÚN] **" + member.user.username + "** salió del servidor.")
        return;
    }

    channelLogHub.send("[USER] **" + member.user.username + "** salió del servidor.")
    return;

};