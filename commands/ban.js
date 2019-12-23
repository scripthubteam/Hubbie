require('dotenv').config();
const caseLogsChannelId = process.env.caseLogsChannelId;

function makeId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < 5; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.run = async (client, msg, args) => {
  if (!msg.member.hasPermission('BAN_MEMBERS')) return msg.channel.send(':x: No posees los permisos necesarios.');

  const banUser = msg.mentions.members.first();
  const banReason = args.join(' ').slice(22);

  if (!banUser) {
    msg.channel.send(':x: Debes mencionar un usuario.');
    return;
  }

  if (!banReason) {
    msg.channel.send(':x: Debes especificar una razón.');
    return;
  }

  if (!msg.guild.member(banUser).bannable) {
    msg.channel.send(':x: No puedo banear a ese usuario.');
    return;
  }

  const teamIdRole = '606222350228127765';
  if (banUser.roles.some((r) => teamIdRole.includes(r.id))) return msg.channel.send('No puedo banear a un miembro de Script Hub Team.');

  msg.guild.member(banUser).ban().catch((e) => {
    console.log(e);
  });
  const caseId = makeId();
  msg.channel.send('Baneaste satisfactoriamente a '+banUser.tag+'.');
  client.channels.get(caseLogsChannelId).send('```diff\n' +
    '- El usuario '+banUser.user.tag+'('+banUser.id+') fue baneado por el moderador/a '+msg.author.tag+' ('+msg.author.id+').\n' +
    '+ Razón: '+banReason+'\n' +
    '+ Caso: '+caseId+'\n' +
    '```');
  banUser.send('Fuiste **baneado** de Script Hub. Debido a **'+banReason+'**.\nSi crees que ésto es incorrecto, contácta con un miembro del staff.\nCaso: '+caseId+'').catch((e) => {
    console.log(e);
  });
};

exports.aliases = [];
exports.public = false;
exports.description = 'Banea a un usuario y genera un caso.';
exports.usage = 's!ban @user razón';
