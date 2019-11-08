const botSchema = require("../models/botSchema")
const globalDb = require("../models/queueSchema")

exports.run = async (bot, msg, args) => {
    let globalQueue = await globalDb.find({
        serverId: msg.guild.id
    })
    let botDb = await botSchema.find({})

    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    if (!globalQueue[0]) return msg.channel.send(":x: Error.")
    if (globalQueue[0].globalQueued === 0) {
        return msg.channel.send(":x: No hay ningún bot en espera.")
    } else {
        let ts = "";

        botDb.forEach(e => {
            if (e.isQueued === true) {
                ts += "Posición: " + e.nQueue + "\nID: **" + e.botId + "**\nPrefijo: **" + e.prefix + "**\nOwner: **" + e.ownerId + "**\n------\n"
            }
        })
        msg.channel.send(ts)
    }
}