const botSchema = require("../models/botSchema")
const globalDb = require("../models/queueSchema")

exports.run = async (bot, msg, args) => {
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    
    let argsData = args.join(" ")
    let parts = argsData.split(";"),
        id = parts[0],
        reason = parts[1];

    if (!id) {
        msg.channel.send(":x: **Debes introducir una ID.**")
        return;
    }
    let dbBot = await botSchema.find({
        botId: id
    })
    let thebot = await bot.fetchUser(id)

    if (!thebot.bot) {
        msg.channel.send(":x: **La ID introducida no pertenece a un Bot**.")
        return;
    }
    if (dbBot[0] === undefined) return msg.channel.send(":x: **La ID del bot introducida no pertenece a una solicitud existente**.")
    if (dbBot[0] !== undefined) {
        if (dbBot[0].isAppr === true) {
            msg.channel.send(":x: Este Bot **no está en fase de solicitud**, fue aprobado el día **" + dbBot[0].day + "**.")
            return;
        }

        if (!reason) return;

        bot.fetchUser(dbBot[0].ownerId).then(async user => {
            user.send(":information_source: Mensaje del **Equipo Administrativo de Script Hub** envíado por el encargado en **Aprobación de solicitudes de Bots** ー **" + msg.author.tag + "**:\n\n**¡Hola " + user.username + "!**\nEste mensaje fue enviado para notificarte nuestra decisión sobre la solicitud dada el día **" + dbBot[0].day + "** para la aprobación de tu Bot en nuestros servicios:\n " + reason)
            await botSchema.findOneAndRemove({
                botId: id
            })
            msg.channel.send(":white_check_mark: La solicitud de **" + thebot.tag + "** fue rechazada con éxito.")
        })

        let global = await globalDb.find({
            serverId: msg.guild.id
        })

        await globalDb.findOneAndUpdate({
            serverId: msg.guild.id
        }, {
            globalQueued: global[0].globalQueued - 1
        })

        let bots = await botSchema.find({})
        bots.forEach(async e => {
            await botSchema.findOneAndUpdate({
                botId: e.botId
            }, {
                nQueue: e.nQueue - 1
            })
        })
        return;
    }
}