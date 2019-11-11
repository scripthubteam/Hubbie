exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.");

  // Se obtienen los bots en espera y se verifica si hay más de uno.
  let queue = await client.db.bots.find({ approvedDate: 0 }).exec();
  if (queue.length < 1) return msg.channel.send(":x: **No hay ningún bot en la lista de espera**.");

  // Se define una variable de salida y se agrega cada bot por orden de lista.
  let out = "Lista de espera:\n";
  queue
    .sort((a, b) => a.queuePosition - b.queuePosition)
    .forEach((bot) => {
      out += `> **${bot.queuePosition}**. ${msg.guild.members.get(bot._id).user.tag} - ${msg.guild.members.get(bot.idOwner).user.tag} - \`${bot.prefix}\`\n`;
    });

  // Se envía la variable que contiene la lista de bots en espera.
  msg.channel.send(out);
}

exports.aliases = [];
exports.public = false;
exports.description = "Muestra todos los bots en la lista de espera.";
exports.usage = "s!cqueue";
