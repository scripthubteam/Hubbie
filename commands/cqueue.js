const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(':x: No posees los permisos necesarios.');

  // Se obtienen los bots en espera y se verifica si hay más de uno.
  if (await botManager.getQueue() === 0) return msg.channel.send(':x: **No hay ningún bot en la lista de espera**.');
  const botsInQueue = await botManager.getNoApprovedBots();

  // Se define una variable de salida y se agrega cada bot por orden de lista.
  let out = 'Lista de espera:\n';
  botsInQueue
      .sort()
      .forEach((bot) => {
        const memberBot = msg.guild.members.get(bot.botId);
        const memberOwner = msg.guild.members.get(bot.ownerId);
        out += `> **${bot.nQueue}**. ${memberBot.user.tag} - ${memberOwner.user.tag} - \`${bot.prefix}\`\n`;
      });

  // Se envía la variable que contiene la lista de bots en espera.
  msg.channel.send(out);
};

exports.aliases = [];
exports.public = false;
exports.description = 'Muestra todos los bots en la lista de espera.';
exports.usage = 's!cqueue';
