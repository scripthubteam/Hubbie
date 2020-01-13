module.exports = class MessageEvent {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    let client = this.client;
    try {
      let data = {};
      let prefix;
      if (message.guild) {
        let guild = await client.findOrCreateGuild({ id: message.guild.id });
        data.guild = guild;
        let member = await client.findOrCreateMember({
          id: message.author.id,
          guildID: message.guild.id
        });
        data.member = member;
      }
      let user = await client.findOrCreateUser({ id: message.author.id });
      data.user = user;

      message.guild
        ? (prefix = data.guild.prefix)
        : (prefix = client.config.bot.prefix);
      if (!message.content.startsWith(prefix) || message.author.bot) return;
      let args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g),
        command = args.shift().toLowerCase(),
        cmd =
          client.commands.get(command) ||
          client.commands.get(client.aliases.get(command));

      if (!cmd) return;
      if (!cmd.config.enabled) {
        return message.channel.send(':x: | Este comando está deshabilitado.');
      }
      if (
        cmd.config.ownerOnly &&
        !client.config.owners.includes(message.author.id)
      ) {
        return message.channel.send(
          ':x: | Este comando es solo para los desarrolladores.'
        );
      }
      if (cmd.config.guildOnly && !message.guild) {
        return message.channel.send(
          ':x: | Este comando solo se puede usar en el servidor.'
        );
      }
      if (message.guild) {
        let needp = [];
        cmd.config.memberPermissions.forEach(p => {
          if (!message.channel.permissionsFor(message.member).has(p)) {
            needp.push(p);
          }
        });
        if (needp.length > 0) {
          return message.channel.send(
            ':x: | No puedes utilizar este comando.\nNecesitas los siguientes permisos:\n`' +
            needp.map(p => `\`${p}\``).join('`, `')
          );
        }
      }
      try {
        cmd.run(message, args, data);
        console.log(
          message.author.tag + ' ha usado el comando `' + cmd.help.name + '`'
        );
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
