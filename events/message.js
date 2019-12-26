require('dotenv').config();
const ticketLogCat = process.env.ticketLogCat;
const TicketSystem = require('../lib/ticketManager');
const ticket = new TicketSystem();
// Bot Modules

module.exports = async (client, message) => {
  // Condiciones útiles para saber si es un bot, si está en mensaje directo y si no es un comando.
  if (message.author.bot) return;
  if (message.channel.type === 'dm') {
    // if (message.author === client.user) return;
    if (!await ticket.ticketExists(message.author.id)) {
      message.client.guilds.get('616806651911208975').createChannel('ticket-'+message.author.id, {type: 'text', parent: ticketLogCat}).then((channel) => {
      }).catch((err) => {
        console.log(err);
      });
      message.channel.send('Gracias por contactarte con el equipo de soporte de Script Hub. Un miembro del equipo atenderá su solicitud en breve.');
    } else if (await ticket.ticketExists(message.author.id)) {
      console.log('asdasdasd');
      ticket.closeTicket(message.author.id);
    }
  } else {
    if (!message.content.toLowerCase().startsWith(process.env.PREFIX)) return;

    // Definición de cosas útiles como argumentos y el propio comando.
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    // Se obtiene el comando por medio de alias o su propio nombre.
    const cmdData = await client.cmds.get(cmd) || await client.cmds.find((c) => c.aliases.some((alias) => alias.toLowerCase() == cmd));

    if (!cmdData) return;

    try {
      // Se ejecuta la función run del archivo del comando obtenido.
      cmdData.runFile.run(client, message, args);
      console.log(`${message.author.tag} ejecutó el comando ${cmd}`);
    } catch (err) {
      // Si hay algún error coloca una variable a true y muestra el error en consola.
      console.error(err);
    }
  }
};
