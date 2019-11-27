require('dotenv').config();
const inviteChannelId = process.env.inviteChannelId;
const botRequestsChannelId = process.env.botRequestsChannelId;
const {RichEmbed} = require('discord.js');

const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  const ID = args[0];
  const PREFIX = args[1];
  // Solamente se puede invitar desde el canal de invitaciones.
  if (msg.channel.id !== inviteChannelId) return;

  // Si el usuario envio el ID como argumento
  if (!ID) return msg.channel.send(':x: **Falta la ID**. La ID es necesaria.');

  // Obtenemos el usuario del bot y si no se encuentra envía mensaje de error.
  let userBot;
  try {
    userBot = await client.fetchUser(ID);
  } catch (err) {
    console.log(err);
    msg.channel.send(':x: **Esa no es una ID válida**. La ID debe ser el identificador de la aplicación del bot.');
    return;
  }
  // Comprueba si existía ya en la base de datos (club de bots)
  if (await botManager.botExists(ID)) return msg.channel.send(':x: **Este bot ya ha sido invitado**.');
  // Comprueba si no es un bot.
  if (!userBot.bot) return msg.channel.send(':x: **La ID introducida no pertenece a un bot**.');
  //  Comprueba si colocó un prefijo para el bot.
  if (!PREFIX) return msg.channel.send(':x: **Por favor, especifica un prefix para tu bot**. El prefix ayudará a saber cómo se ejecuta tu bot.');
  // Obtenemos los bots actuales en la lista de espera y creamos el bot en la base de datos con esa posición.
  const createdBot = await botManager.addBot(ID, PREFIX, msg.author.id);

  const embedServer = new RichEmbed()
      .setTitle('Solicitud de invitación')
      .setDescription(`¡Hola **${msg.author.tag}**! Gracias por invitar tu bot a **Script Hub**, este será en lo más breve posible introducido al servidor si cumple los requisitos. Te enviaremos una notificación cuando se decida sobre tu solicitud.`)
      .addField('🤖 Bot', userBot.tag, true)
      .addField('ℹ Prefix', `\`${PREFIX}\``, true)
      .addField('💻 Desarrollador', msg.author.tag, true)
      .setThumbnail(userBot.displayAvatarURL)
      .setColor(0x000000)
      .setFooter('Petición generada', msg.author.displayAvatarURL)
      .setTimestamp();

  const embedStaff = new RichEmbed()
      .setTitle('Solicitud de invitación')
      .setDescription(`El usuario **${msg.author.tag}** ha solicitado que su bot **${userBot.tag}** sea invitado a **Script Hub**.\n[CLICK PARA INVITAR AQUÍ](https://discordapp.com/api/oauth2/authorize?client_id=${userBot.id}&permissions=0&scope=bot&guild_id=${msg.guild.id})`)
      .setFooter('Detalles de la petición')
      .addField('🤖 Bot', userBot.tag, true)
      .addField('ℹ Prefix', `\`${PREFIX}\``, true)
      .addField('💻 Desarrollador', msg.author.tag, true)
      .setThumbnail(userBot.displayAvatarURL)
      .setColor(0x000000)
      .setFooter('Petición generada', msg.author.displayAvatarURL)
      .setTimestamp();

  const embedDesarrollador = new RichEmbed()
      .setTitle('Su solicitud está pendiente de aprobación')
      .setImage('https://i.imgur.com/D56tkxB.png')
      .setDescription(`Le notificamos que su bot **${userBot.tag}** está pendiente de ser aprobado o ser rechazado a la brevedad. Su puesto en la cola de espera es **${createdBot.nQueue}**.`)
      .setColor(0x000000)
      .setFooter('Equipo de Administración General')
      .setTimestamp();

  msg.channel.send(embedServer);
  msg.author.send(embedDesarrollador);
  client.channels.get(botRequestsChannelId).send(':information_source: Para rechazar una solicitud, utilice `s!denegar <ID>`', embedStaff);
};


exports.aliases = ['inv'];
exports.public = true;
exports.description = 'Invita a tu bot.';
exports.usage = 's!invite ID Prefix';
