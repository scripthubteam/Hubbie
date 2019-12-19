require('dotenv').config();
const privateLogsChannelId = process.env.privateLogsChannelId;
const {RichEmbed} = require('discord.js');

exports.run = async (client, msg, args) => {
    // Verifica si el usuario pertenece al personal del servidor.
    if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(':x: No posees los permisos necesarios.');

    let kickUser = msg.mentions.member.first();
    let kickReason = args.join(" ").slice(22);

    if (!kickUser) {
        msg.channel.send(":x: Debes mencionar un usuario.");
        return;
    }

    if (!kickReason) {
        msg.channel.send(":x: Debes especificar una razón.");
        return;
    }

    msg.guild.member(kickUser).kick();
    client.channels.get(privateLogsChannelId).send("```\n" +
    "El usuario "+kickUser.user.tag+"("+kickUser.id+") fue kickeado por el moderador/a "+msg.author.tag+" ("+msg.author.id+").\n" +
    "Razón: "+kickReason+"\n" +
    "```");
}