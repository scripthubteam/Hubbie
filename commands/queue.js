const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  try {
    const userBot = await client.fetchUser(args[0]);
    const BOT_ID = userBot.id;
    if (!await botManager.botExists(BOT_ID)) return msg.channel.send(':x: **Este bot no ha sido invitado**.');

    // Comprueba si tiene está aprovado.
    if (await botManager.isApproved(BOT_ID)) return msg.channel.send(':x: **Este bot no está en la lista de espera**.');

    // Envía la posición del bot actual en la lista de espera.
    msg.channel.send(`La posición de **${userBot.tag}** en la cola es de **${await botManager.getQueue(BOT_ID)}**.`);
  } catch (e) {
    // Mensaje de error por si el usuario no existe o pasa algo erróneo o no esperado.
    msg.channel.send(':x: **Esa no es una ID válida**. La ID debe ser el identificador de la aplicación del bot.');
  }
};

exports.aliases = ['q'];
exports.public = true;
exports.description = 'Muestra el número en la lista de espera.';
exports.usage = 's!queue ID';
