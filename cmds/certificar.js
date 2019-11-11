exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.");

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  let userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();

  if (!userBot) return msg.channel.send(":x: **El bot que intentas buscar no está en el servidor**.");

  if (!userBot.user.bot) return msg.channel.send(":x: **El usuario que mencionaste no es un bot**.");

  // Obtiene el bot de la base de datos o club.
  let dbBot = await client.db.bots.findOne({ _id: userBot.id }).exec();

  // Comprueba si está en el club.
  if (!dbBot) return msg.channel.send(":x: **Este bot no está registrado en el club de bots**.");

  // Comprueba si ya está certificado/verificado.
  if (dbBot.verified) return msg.channel.send(":x: **El bot que intentas certificar, ya está certificado**.");

  // Lo coloca en verificado y lo guarda.
  dbBot.verified = true;
  dbBot.save();

  // Envía mensaje de confirmación.
  msg.channel.send("**El bot fue certificado correctamente.**");
}

exports.aliases = [];
exports.public = false;
exports.description = "Certifica un bot del club de bots.";
exports.usage = "s!certificar Mención-ID";
