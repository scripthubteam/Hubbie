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

    let argsData = args.join(" ")
    let parts = argsData.split(";"),
        id = parts[0],
        reason = parts[1];

    if(!id){
        msg.channel.send(":x: **Debes introducir una ID.**")
        return;
    }

    const dbBot = await BotStorage_[id];
    const thebot = await bot.fetchUser(id)

    if(!thebot.bot){
        msg.channel.send(":x: **La ID introducida no pertenece a un Bot**.")
        return;
    }
    if(dbBot === null) return msg.channel.send(":x: **La ID del bot introducida no pertenece a una solicitud existente**.")
    if(dbBot !== null) {
        if(dbBot.data.appr.isAppr === true){
            msg.channel.send(":x: Este Bot **no está en fase de solicitud**, fue aprobado el día **"+dbBot.data.appr.day+"**.")
            return;
        }

        if (!reason) {
            bot.fetchUser(dbBot.owner.id).then(a => {
                msg.channel.send(":information_source: **El motivo no fue introducido, pero se utilizará uno predeterminado**")
                a.send(":information_source: Mensaje del **Equipo Administrativo de Script Hub** envíado por el encargado en **Aprobación de solicitudes de Bots** ー **"+msg.author.tag+"**:\n\n**¡Hola "+a.username+"!**\nEste mensaje fue enviado para notificarte nuestra decisión sobre la solicitud dada el día **"+dbBot.data.request.day+"** para la aprobación de tu Bot en nuestros servicios:\n **Ha sido rechazada, vuelve a intertarlo otro día.** Puedes pedirle motivos al encargado para obtener más información sobre la aprobación.")
                delete BotStorage_[id]
                Reg.save("BotStorage_", JSON.stringify(BotStorage_))
                msg.channel.send(":white_check_mark: La solicitud de **"+thebot.tag+"** fue rechazada con éxito.")
                Global[msg.guild.id] -= 1;
                Reg.save("Global", JSON.stringify(Global));
                Object.keys(BotStorage_).forEach(x => {
                    BotStorage_[x].data.appr.nQueue -= 1
                });
                return;
            })
          }

          bot.fetchUser(dbBot.owner.id).then(a => {
                a.send(":information_source: Mensaje del **Equipo Administrativo de Script Hub** envíado por el encargado en **Aprobación de solicitudes de Bots** ー **"+msg.author.tag+"**:\n\n**¡Hola "+a.username+"!**\nEste mensaje fue enviado para notificarte nuestra decisión sobre la solicitud dada el día **"+dbBot.data.request.day+"** para la aprobación de tu Bot en nuestros servicios:\n "+reason)
                delete BotStorage_[id]
                Reg.save("BotStorage_", JSON.stringify(BotStorage_))
                msg.channel.send(":white_check_mark: La solicitud de **"+thebot.tag+"** fue rechazada con éxito.")
        })
        Global[msg.guild.id].q -= 1;
        Reg.save("Global", JSON.stringify(Global));
        Object.keys(BotStorage_).forEach(x => {
            BotStorage_[x].data.appr.nQueue -= 1
        });
        return;
    }
}