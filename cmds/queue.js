exports.run = async (client, msg, args) => {
  try {
    let userBot = await client.fetchUser(args[0]);
    // Comprueba si no existe en la base de datos (club de bots).
    let dbBot = await client.db.bots.findOne({ botId: userBot.id }).exec();
    if (!dbBot) return msg.channel.send(":x: **Este bot no ha sido invitado**.");

    // Comprueba si tiene está aprovado.
    if (dbBot.approvedDate !== 0) return msg.channel.send(":x: **Este bot no está en la lista de espera**.");

    // Envía la posición del bot actual en la lista de espera.
    msg.channel.send(`La posición de **${userBot.tag}** en la cola es de **${dbBot.nQueue}**.`);
  } catch (e) {
    // Mensaje de error por si el usuario no existe o pasa algo erróneo o no esperado.
    msg.channel.send(":x: **Esa no es una ID válida**. La ID debe ser el identificador de la aplicación del bot.");
  }
};

exports.aliases = ['q'];
exports.public = true;
exports.description = "Muestra el número en la lista de espera.";
exports.usage = "s!queue ID";
