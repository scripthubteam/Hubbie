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

  const banUser = args[0];
  const banReason = args.slice(1).join(' ');

  if (!banUser) {
    msg.channel.send(':x: Debes ingresar la ID del usuario a banear.');
    return;
  }

  if (isNaN(banUser) === true) {
    msg.channel.send(':x: La ID debe ser numérica.');
    return;
  }

  if (!banReason) {
    msg.channel.send(':x: Debes especificar una razón.');
    return;
  }

  if (msg.guild.members.get(banUser)) {
    msg.channel.send(':x: El usuario se encuentra en el servidor, utiliza el comando `ban`.');
    return;
  }

  msg.guild.fetchBans().then((bans) => {
    if (bans.get(banUser)) {
      msg.channel.send(':x: Ese usuario ya está baneado.');
      return;
    }
    msg.guild.ban(banUser, banReason).then((banned) => {
      const caseId = makeId();
      const user = client.users.get(banUser);
      msg.channel.send('Baneaste satisfactoriamente a '+user.username+'.');
      client.channels.get(caseLogsChannelId).send('```diff\n' +
				'- El usuario '+user.username+'('+user.id+') fue baneado por el moderador/a '+msg.author.tag+' ('+msg.author.id+').\n' +
				'+ Razón: '+banReason+'\n' +
				'+ Caso: '+caseId+'\n' +
				'```');
    }).catch((e) => console.log(e));
  });
};

exports.aliases = ['hb'];
exports.public = false;
exports.description = 'Banea a un usuario que no esté en el servidor.';
exports.usage = 's!hackban id razón';
