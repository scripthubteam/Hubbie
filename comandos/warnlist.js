const db = require("../db/db.js");
const Discord = require("discord.js")
db.loadRegHelper();
var Reg,
    Warns;

if (typeof Warns == 'undefined') {
    Warns = {};
    try {
        Warns = JSON.parse(Reg.get("Warns"));
    } catch (e) {
        Warns = {};
    }
}

exports.run = async (bot, msg, args) => {

    if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(":x: No posees los permisos necesarios.")

    var ment = msg.mentions.members.first();
    var toPush = [];

    if (!ment) {
        msg.channel.send(":x: Menciona a un usuario");
        return;
    }

    if (!Warns[ment.id]) {
        msg.channel.send(":x: Este usuario no tiene amonestaciones.");
        return;
    }

    var obj = Object.values(Warns[ment.id].razones);
    var e = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setAuthor("Amonestaciones de "+ment.user.username, bot.user.avatarURL)
        .setDescription("```\nCantidad de amonestaciones: "+Warns[ment.id].cantidad+"\n\n"+obj.join("\n")+"```")
    msg.channel.send(e)
};