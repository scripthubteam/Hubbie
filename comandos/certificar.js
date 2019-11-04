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

    const mentbot = msg.mentions.members.first();

    if(!mentbot) {
        msg.channel.send(":x: Necesitas mencionar un bot.");
        return;
    }

    const dbBot = BotStorage_[mentbot.id]

    if(dbBot.config.certified === true) {
        msg.channel.send(":x: El bot ingresado ya está certificado.");
        return;
    }

    dbBot.config.certified = true;
    Reg.save("BotStorage_", JSON.stringify(BotStorage_));
    msg.channel.send("**El bot fue certificado.**");
    return;

}