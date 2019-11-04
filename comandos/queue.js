const Discord = require("discord.js");
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

    if (isNaN(args[0])) {
        msg.channel.send(":x: **Esa no es una ID válida.** La ID debe contener el número del cliente de la apliación/usuario.");
        return;
    }

    var user = await bot.fetchUser(args[0]);
    var dbBot = await BotStorage_[user.id];

    if (dbBot !== undefined) {
        if (dbBot.data.appr.isQueued === true) {
            msg.channel.send("La poscición de **"+user.tag+"** en la cola es de **"+dbBot.data.appr.nQueue+"**");
            return;
        } else {
            msg.channel.send(":x: Este bot no está en la cola de espera.")
        }
    } else {
        msg.channel.send(":x: Este bot no está en nuestra base de datos.");
        return;
    }

}