const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(':x: No posees los permisos necesarios.');

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  const userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();
  const BOT_ID = userBot.id;
  if (!userBot) return msg.channel.send(':x: **El bot que intentas buscar no está en el servidor**.');

  if (!userBot.user.bot) return msg.channel.send(':x: **El usuario que mencionaste no es un bot**.');

  // Comprueba si está en el club.
  if (!botManager.botExists(BOT_ID)) return msg.channel.send(':x: **Este bot no está registrado en el club de bots**.');

  // Comprueba si ya está certificado/verificado.
  if (await botManager.isCertified(BOT_ID)) return msg.channel.send(':x: **El bot que intentas certificar, ya está certificado**.');

  await botManager.certifyBot(BOT_ID);

  // Envía mensaje de confirmación.
  msg.channel.send('**El bot fue certificado correctamente.**');
};

exports.aliases = [];
exports.public = false;
exports.description = 'Certifica un bot del club de bots.';
exports.usage = 's!certificar Mención-ID';
