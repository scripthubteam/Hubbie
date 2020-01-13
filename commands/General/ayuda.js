const Command = require('../../base/Command.js');

module.exports = class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'ayuda',
      description: 'Muestra la ayuda.',
      usage: prefix => `\`${prefix}help [comando]\``,
      examples: prefix => `\`${prefix}help\`, \`${prefix}help ping\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: ['help', 'h'],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      let embed = require('discord.js').RichEmbed,
        comandos = this.client.commands,
        aliases = this.client.aliases,
        tag = "";
      if (!args[0]) {
        let or = {
          GENERAL: 10,
          TICKETS: 15,
          BOTS: 20,
          SUGERENCIAS: 25
        };
        let categorias = [];
        comandos.forEach(command => {
          if (!categorias.includes(command.help.category)) {
            categorias.push(command.help.category);
          }
        });
        let temp = [];
        for (let i = 0; i < categorias.length; i++) {
          temp.push(null);
        }
        for (let cat of categorias) {
          temp[or[cat.toUpperCase()]] = cat;
        }
        categorias = temp.filter(x => x !== null);
        let a = new embed()
          .setColor(this.client.colors.hub)
          .setAuthor(
            this.client.user.username,
            this.client.user.displayAvatarURL
          )
          .setTitle('Lista de comandos')
          .setDescription(
            'Para ver la ayuda de un comando usa `' +
            (message.guild ? data.guild.prefix : 'h!') +
            'ayuda <comando>`'
          )
          .setFooter(message.author.tag, message.author.displayAvatarURL);
        categorias.forEach(cat => {
          let commandsize = comandos.filter(cmd => cmd.help.category === cat);
          a.addField(
            cat + ' ◈ (' + commandsize.size + ')',
            commandsize
              .map(cmd => `\`${cmd.help.name}\` - ${cmd.help.description}`)
              .join('\n')
          );
        });
        message.channel.send({ embed: a });
        const b = new embed()
          .setColor(0x00ebb0)
          .setTitle('Reporta errores y contribuye. Sé parte de Script Hub.')
          .setDescription(
            '**Script Hub Bot** es uno de los proyectos **open source** de Script Hub que es publicado gracias al equipo de desarrolladores sin ánimos de lucro de **Script Hub OTA**. \n[¡Contribuye libremente con nosotros y aprende!](https://github.com/scripthubteam)'
          )
          .setThumbnail('https://i.imgur.com/B1YsRel.jpg');
        message.channel.send({ embed: b });
        if (message.guild && message.member.hasPermission('MANAGE_GUILD')) {
          or = {
            DEV: 10
          };
          let categorias = [];
          comandos.forEach(command => {
            if (!categorias.includes(command.help.category)) {
              categorias.push(command.help.category);
            }
          });
          let temp = [];
          for (let i = 0; i < categorias.length; i++) {
            temp.push(null);
          }
          for (let cat of categorias) {
            temp[or[cat.toUpperCase()]] = cat;
          }
          categorias = temp.filter(x => x !== null);
          let c = new embed()
            .setColor(this.client.colors.hub)
            .setAuthor(
              this.client.user.username,
              this.client.user.displayAvatarURL
            )
            .setTitle('Panel de Administración')
            .setDescription(
              'Para ver la ayuda de un comando usa `' +
              (message.guild ? data.guild.prefix : 'h!') +
              'ayuda <comando>`'
            )
            .setFooter(message.author.tag, message.author.displayAvatarURL);
          categorias.forEach(cat => {
            let commandsize = comandos.filter(cmd => cmd.help.category === cat);
            c.addField(
              cat + ' • (' + commandsize.size + ')',
              commandsize
                .map(cmd => `\`${cmd.help.name}\` - ${cmd.help.description}`)
                .join('\n')
            );
          });
          message.author.send({ embed: c });
        }
      } else {
        if (
          !comandos.has(args[0].toLowerCase()) &&
          !comandos.has(aliases.get(args[0].toLowerCase()))
        ) {
          return message.channel.send(':x: | Ese comando no existe.');
        } else {
          let h =
            comandos.get(args[0].toLowerCase()) ||
            comandos.get(aliases.get(args[0].toLowerCase()));
          let e = new embed()
            .setColor(this.client.colors.hub)
            .setTitle('Ayuda del comando: `' + h.help.name + '`')
            .setDescription('Descripción: `' + h.help.description + '`')
            .addField('Uso:', h.help.usage(data.guild.prefix))
            .addField('Ejemplo(s):', h.help.examples(data.guild.prefix))
            .addField(
              'Alias(es):',
              h.config.aliases.map(a => `\`${a}\``).join('`, `')
            );
          message.channel.send({ embed: e });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
