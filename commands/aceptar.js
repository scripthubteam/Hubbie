require('dotenv').config();
const playgroundChannelId = process.env.playgroundChannelId;
const {RichEmbed} = require('discord.js');
// Bot Modules
const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission('MANAGE_SERVER')) return msg.channel.send(':x: No posees los permisos necesarios.');

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  const userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();
  const BOT_ID = userBot.id;
  if (!userBot) return msg.channel.send(':x: **El bot que intentas buscar no está en el servidor**.');

  if (!userBot.user.bot) return msg.channel.send(':x: **El usuario que mencionaste no es un bot**.');

  if (!await botManager.botExists(BOT_ID)) return msg.channel.send(':x: **Este bot no está registrado en el club de bots**.');

  // Comprueba si no está en fase de solicitud
  if (await botManager.isApproved(BOT_ID)) return msg.channel.send(`:x: **Este bot no está en fase de solicitud**`);

  const acceptedBot = await botManager.acceptBot(BOT_ID);
  // Se agregan y se quitan roles del bot para que esté en el club de bots.
  userBot.removeRole(msg.guild.roles.find((r) => r.name === 'ToTest'));
  userBot.addRole(msg.guild.roles.find((r) => r.name === 'Club de Bots'));

  // Se crea y se envía un mensaje con un Embed indiciándole a todos que hay un nuevo bot en el club de bots.
  const embedServer = new RichEmbed()
      .setTitle('¡Nuevo bot en el club de bots!')
      .setDescription(`**◈ Prefijo**: ${acceptedBot.prefix}\n**◈ Dueño**: ${msg.guild.members.get(acceptedBot.ownerId).toString()}`)
      .setColor(0x01abb6)
      .setImage(userBot.user.displayAvatarURL)
      .setFooter('Script Hub')
      .setTimestamp();
  const embedOwner = new RichEmbed()
      .setColor(0x049c60)
      .addField('¡Bot aprobado!', `Tu bot **${userBot.user.tag}** es ahora parte del club de bots de Script Hub, verifica el canal <#${playgroundChannelId}>, puedes utilizar \`s!infobot\` para ver información relacionada con tu bot guardada en el club y ya puedes empezar a usar tu bot!`)
      .setThumbnail(userBot.user.displayAvatarURL)
      .setImage('https://i.imgur.com/D56tkxB.png')
      .setFooter('Equipo de aprobaciones de aplicaciones')
      .setTimestamp();

  await client.channels.get(playgroundChannelId).send(embedServer);
  await client.users.get(acceptedBot.ownerId).send(embedOwner);

  // Se envía un mensaje Embed al dueño de que el bot ha sido aceptado correctamente.
};

exports.aliases = [];
exports.public = false;
exports.description = 'Acepta el bot como nuevo miembro del club de bots.';
exports.usage = 's!aceptar Mención-ID';
