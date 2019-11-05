const Discord = require('discord.js')
const db = require("../db/db.js");
let Reg = db.loadRegHelper();
var BotStorage_;
const chan = require("../chans.json")
Reg.init("BotStorage_", "{}");

if (typeof BotStorage_ == 'undefined') {
    BotStorage_ = {};
    try {
        BotStorage_ = JSON.parse(Reg.get("BotStorage_"));
    } catch (e) {
        BotStorage_ = {};
    }
}

module.exports = async (bot, member) => {

    let channelLogHub = bot.channels.get(chan.logChan),
        requiere = bot.channels.get(chan.staffTestChan);
    var dbBot = await BotStorage_[member.user.id];

    if (member.user.bot) {
        if (dbBot) {
            channelLogHub.send(":robot: [BOT] **"+member.user.username+"** fue agregado.");
            requiere.send(`${member.user.tag}, requiere de aprobación.`).catch(e => requiere.send(e))
            member.addRole(member.guild.roles.find(f => f.name === "ToTest"));

            BotStorage_[member.user.id].data.appr.isAppr = true;
            BotStorage_[member.user.id].data.appr.isQueued = false;
            return;
        }
    channelLogHub.send(":robot: [BOT] **"+member.user.username+"** entró al servidor.");
    return;
    }
    let embed = {
        "title": "¡Bienvenido/a "+member.user.username+"!",
        "description": "Gracias por unirte a **Script Hub**.\n**—** Lee <#606204103500103700> para empezar tu recorrido por el servidor.\n**—** Lee <#606688095328272394> para seguir el fundamento del servidor.\n**—** ¿Necesitas ayuda? Consulta tus dudas en <#614201710855979102>.",
        "color": 255068,
        "timestamp": new Date(),
        "footer": {
          "text": member.guild.name+" - N#"+member.guild.memberCount
        },
        "image": {
          "url": "https://i.imgur.com/D56tkxB.png"
        }
    };
    let channelGuild = bot.channels.get(chan.logChan);
    channelGuild.send(member.user,{ embed });
    member.addRole(member.guild.roles.find(f => f.name === "Usuario"));
    channelLogHub.send("[USER] **"+member.user.username+"** entró al servidor.")
    return;
};