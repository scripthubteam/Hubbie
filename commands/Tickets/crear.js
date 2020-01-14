const Command = require('../../base/Command.js');

module.exports = class Tickets extends Command {
  constructor(client) {
    super(client, {
      name: 'crear',
      description: 'Crea un ticket.',
      usage: prefix => `\`${prefix}crear [<razón>]\``,
      examples: prefix =>
        `\`${prefix}crear Hay un problema que no me deja ser feliz.\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: ['new'],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      let server = this.client.guilds.get(this.client.config.servidor.id),
        user = data.user,
        channel = server.channels.find(
          x => x.name === `ticket-${message.author.id}`
        ),
        channels = server.channels
          .array()
          .filter(x => x.name.includes(`ticket-`));
      if (channels.size >= 10)
        return message.channel.send(
          ':x: | Hay muchos tickets creados actualmente, ¡intenta más tarde!'
        );
      if (channel) {
        return message.channel.send(
          ':x: | Ya tienes un ticket creado. <#' + channel.id + '>'
        );
      } else {
        let reasson = args[0] ? args.join(' ') : '*Sin razón*';
        user.tickets = {
          reason: reasson,
          status: true
        };
        let create = await server.createChannel(`ticket-${message.author.id}`, {
          type: 'text',
          parent: this.client.config.servidor.categorias.tickets.id
        });
        message.channel.send(
          ':white_check_mark: | Se ha creado correctamento tu ticket. <#' +
            create.id +
            '>'
        );
        await create.send(
          'El usuario ' +
            message.author.toString() +
            ' ha abierto un ticket con la razón: `' +
            reasson +
            '` ||<@&' +
            this.client.config.servidor.roles.staff.departamento.comunidad +
            '>||'
        );
        await create.overwritePermissions(
          message.author,
          {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: null,
            ATTACH_FILES: true,
            EMBED_LINKS: true
          },
          'Ticket creado.'
        );
        user.tickets = {
          reason: reasson,
          channel: create.id,
          status: true
        };
        await user.save();
      }
    } catch (e) {
      console.error(e);
    }
  }
};
