const Command = require('../../base/Command.js');

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Muestra la latencia en milisegundos.',
      usage: prefix => `\`${prefix}ping\``,
      examples: prefix => `\`${prefix}ping\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: ['ms'],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      message.channel.send(`Pong! ${Math.floor(client.ping)}ms.`);
    } catch (e) {
      console.error(e);
    }
  }
};
