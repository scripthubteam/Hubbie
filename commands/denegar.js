const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(':x: No posees los permisos necesarios.');

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  const userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();

  if (!userBot) return msg.channel.send(':x: **El bot que intentas buscar no está en el servidor**.');

  if (!userBot.user.bot) return msg.channel.send(':x: **El usuario que mencionaste no es un bot**.');

  // Comprueba si está en el club.
  if (!await botManager.botExists(userBot.id)) return msg.channel.send(':x: **Este bot no está registrado en el club de bots**.');


  // Comprueba si tiene una razón válida.
  if (args.slice(1).join(' ').length <= 5) return msg.channel.send(':x: **Especifica una razón por la cual vas a rechazar este bot**.');

  // Comprueba si no está en fase de solicitud
  if (await botManager.isApproved(userBot.id)) return msg.channel.send(`:x: **Este bot no está en fase de solicitud.**`);

  const botDeleted = botManager.getBot(userBot.id);

  // Obtiene el dueño del bot.
  const userOwner = msg.guild.members.get(botDeleted.idOwner);

  // Envía mensaje de denegación al dueño o desarrollador del bot.
  if (userOwner) {
    /**
         * @todo Convertir el siguiente mensaje en un embed
         */
    userOwner.send(`:information_source: Mensaje del **equipo de aprobaciones de aplicaciones de Script Hub** enviado por el encargado en **aprobación de solicitudes de bots** ー **${msg.author.tag}**:\n\n¡Hola **${userOwner.tag}**! Tenemos información de tu bot: **${userBot.user.tag}**.\nEste mensaje fue enviado para notificarte nuestra decisión sobre la solicitud dada el día **${new Date().toLocaleDateString()}** a las **${new Date().toLocaleTimeString()}** hora GMT (UTC) para la aprobación de tu bot en nuestros servicios:\n> ${args.slice(1).join(' ')}`)
        .catch((e) => {
          console.error(e);
        });
  }

  // Envía mensaje de confirmación a la persona que ejecutó el comando en el mismo canal.
  msg.channel.send(`:white_check_mark: El bot **${userBot.user.tag}** fue rechazado con éxito.`);

  // Por último se quita el bot del servidor para en el evento ser quitado de la base de datos.
  if (userBot.kickable) userBot.kick('rechazado del club de bots.');
  await botManager.rejectBot(userBot.id);
};

exports.aliases = [];
exports.public = false;
exports.description = 'Deniega el acceso de un bot al club de bots.';
exports.usage = 's!denegar Mención-ID';
