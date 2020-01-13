const Command = require('../../base/Command.js');

module.exports = class Tickets extends Command {
  constructor(client) {
    super(client, {
      name: 'cerrar',
      description: 'Cierra un ticket.',
      usage: prefix => `\`${prefix}cerrar <usuario>\``,
      examples: prefix => `\`${prefix}cerrar Sandessat\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: ['close'],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      if (!args[0]) {
        return message.channel.send(':x: | Necesitas especificar un usuario.');
      } else {
        let user,
          usuario =
            message.mentions.users.first() ||
            this.client.users.find(x =>
              `${x.tag}`.toLowerCase().includes(args[0].toLowerCase())
            ) ||
            this.client.users.get(args[0]);
        if (usuario) {
          user = await this.client.findOrCreateUser({
            id: usuario.id
          });
          if (user.tickets.reason) {
            let toB = await this.client.channels.get(user.tickets.channel);
            toB.delete();
            user.tickets = {
              reason: '...',
              channel: undefined,
              status: false
            };
            await user.save();
          } else {
            return message.channel.send(':x: | Ese usuario no tiene tickets.');
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
