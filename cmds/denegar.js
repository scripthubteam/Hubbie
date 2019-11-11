exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: No posees los permisos necesarios.");

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  let userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();

  if (!userBot) return msg.channel.send(":x: **El bot que intentas buscar no está en el servidor**.");

  if (!userBot.user.bot) return msg.channel.send(":x: **El usuario que mencionaste no es un bot**.");

  // Obtiene el bot de la base de datos o club.
  let dbBot = await client.db.bots.findOne({ _id: userBot.id }).exec();

  // Comprueba si está en el club.
  if (!dbBot) return msg.channel.send(":x: **Este bot no está registrado en el club de bots**.");

  // Obtiene el dueño del bot.
  let userOwner = msg.guild.members.get(dbBot.idOwner);

  // Comprueba si tiene una razón válida.
  if (args.slice(1).join(" ").length <= 5) return msg.channel.send(":x: **Especifica una razón por la cual vas a rechazar este bot**.");

  // Comprueba si no está en fase de solicitud
  if (dbBot.approvedDate !== 0) return msg.channel.send(`:x: **Este bot no está en fase de solicitud**, fue aprobado el día **${new Date(dbBot.approvedDate).toLocaleDateString()}** a las **${new Date(dbBot.approvedDate).toLocaleTimeString()}** hora GMT (UTC).`);

  // Cambia la posición de la cola de espera de todos los bots.
  let queue = await client.db.bots.find({ approvedDate: 0 }).exec();
  queue
    .slice(queue.findIndex(bot => bot.queuePosition === dbBot.queuePosition) + 1)
    .sort((a, b) => a.queuePosition - b.queuePosition)
    .forEach(async (bot) => {
      let queueDbBot = await client.db.bots.findOne({ _id: bot.id }).exec();
      queueDbBot.queuePosition -= 1;
      queueDbBot.save();
    });

  // Envía mensaje de denegación al dueño o desarrollador del bot.
  if (userOwner) userOwner.send(`:information_source: Mensaje del **equipo de aprobaciones de aplicaciones de Script Hub** enviado por el encargado en **aprobación de solicitudes de bots** ー **${msg.author.tag}**:\n\n¡Hola **${userOwner.user.tag}**! Tenemos información de tu bot: **${userBot.user.tag}**.\nEste mensaje fue enviado para notificarte nuestra decisión sobre la solicitud dada el día **${new Date().toLocaleDateString()}** a las **${new Date().toLocaleTimeString()}** hora GMT (UTC) para la aprobación de tu bot en nuestros servicios:\n> ${args.slice(1).join(" ")}`).catch(() => { });

  // Envía mensaje de confirmación a la persona que ejecutó el comando en el mismo canal.
  msg.channel.send(`:white_check_mark: El bot **${userBot.user.tag}** fue rechazado con éxito.`);

  // Por último se quita el bot del servidor para en el evento ser quitado de la base de datos.
  setTimeout(() => {
    client.onlyDeleteUsers.push(userBot.id);
    if (userBot.kickable) userBot.kick("rechazado del club de bots.");
  }, 1250);
}

exports.aliases = [];
exports.public = false;
exports.description = "Deniega el acceso de un bot al club de bots.";
exports.usage = "s!denegar Mención-ID";
