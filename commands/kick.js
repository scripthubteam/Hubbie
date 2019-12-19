require('dotenv').config();
const caseLogsChannelId = process.env.caseLogsChannelId;
const {RichEmbed} = require('discord.js');

function makeId() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.run = async (client, msg, args) => {
    
    if (!msg.member.hasPermission('KICK_MEMBERS')) return msg.channel.send(':x: No posees los permisos necesarios.');

    let kickUser = msg.mentions.members.first();
    let kickReason = args.join(" ").slice(22);

    if (!kickUser) {
        msg.channel.send(":x: Debes mencionar un usuario.");
        return;
    }

    if (!kickReason) {
        msg.channel.send(":x: Debes especificar una razón.");
        return;
    }

    if (!msg.guild.member(kickUser).kickable) {
        msg.channel.send(":x: No puedo kickear a ese usuario.");
        return;
    }
    let teamIdRole = "606222350228127765";
    if (kickUser.roles.some(r => teamIdRole.includes(r.id))) return msg.channel.send("No puedo kickear a un miembro de Script Hub Team.")

    msg.guild.member(kickUser).kick().catch(e => {
        console.log(e)
    });
    let caseId = makeId();
    client.channels.get(caseLogsChannelId).send("```diff\n" +
    "- El usuario "+kickUser.user.tag+"("+kickUser.id+") fue kickeado por el moderador/a "+msg.author.tag+" ("+msg.author.id+").\n" +
    "+ Razón: "+kickReason+"\n" +
    "+ Caso: "+caseId+"\n" +
    "```");
    kickUser.send("Fuiste **kickeado** de Script Hub. Debido a **"+kickReason+"**.\nSi crees que ésto es incorrecto, contácta con un miembro del staff.\nCaso: "+caseId+"").catch(e => {
        console.log(e)
    });
}

exports.aliases = [];
exports.public = false;
exports.description = 'Kickea a un usuario y genera un caso.';
exports.usage = 's!kick @user razón';