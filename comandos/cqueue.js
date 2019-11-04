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
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    if (!Global) return msg.channel.send(":x: Error.")
    if (Global[msg.guild.id].q === 0) {
        return msg.channel.send(":x: No hay ningún bot en espera.")
    } else {
        var ts = [];
        Object.keys(BotStorage_).forEach(x => {
            if (BotStorage_[x].data.appr.isQueued === true) {
                ts.push("Poscición: "+BotStorage_[x].data.appr.nQueue+"\nID: **"+BotStorage_[x].data.id+"**\nPrefijo: **"+BotStorage_[x].config.prefix+"**\nOwner: **"+BotStorage_[x].owner.id+"**\n------");
            }
        });
        ts = ts.join("\n")
        msg.channel.send(ts)
    }   
}