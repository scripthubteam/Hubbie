const Command = require('../../base/Command.js'),
  Discord = require('discord.js'),
  { exec } = require('child_process'),
  util = require('util');
module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evalúa código.',
      usage: prefix => `\`${prefix}eval <código>\``,
      examples: prefix => `\`${prefix}eval message.guild\``,
      enabled: true,
      ownerOnly: true,
      guildOnly: false,
      aliases: ['e'],
      memberPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data) {
    try {
      let author = message.author,
        member = message.member,
        guild = message.guild,
        channel = message.channel,
        client = message.client,
        config = client.config,
        msg = message;
      try {
        let evalued = await eval(args.join(' '));
        if (typeof evalued !== 'string')
          evalued = util.inspect(evalued, { depth: 0 });
        if (evalued.length > 1950) {
          message.channel.send('> Error: El resultado es muy largo');
        } else if (evalued.includes(config.tokens.bot || config.tokens.mongodb)) {
          message.channel.send('> Error: El resultado contiene un token');
        } else {
          message.channel.send('> Hecho:\n```js\n' + evalued + '\n```');
        }
      } catch (err) {
        err = util.inspect(err, { depth: 0 });
        if (err.includes(config.tokens.bot || config.tokens.mongodb))
          err = err.replace(config.tokens.bot || config.tokens.mongodb, 'T0K3N');
        message.channel.send('> Error: \n```js\n' + err + '\n```');
      }
    } catch (e) {
      console.error(e);
    }
  }
};
