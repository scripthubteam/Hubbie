const Command = require('../../base/Command.js');

module.exports = class ECommand extends Command {
  constructor(client) {
    super(client, {
      name: '',
      description: '',
      usage: prefix => `\`${prefix}\``,
      examples: prefix => `\`${prefix}\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
    } catch (e) {
      console.error(e);
    }
  }
};
