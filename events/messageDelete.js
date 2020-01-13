let { RichEmbed } = require('discord.js');
module.exports = class MessageDeleteEvent {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    try {
      const embed = new RichEmbed()
        .setColor(0xf04947)
        .setTitle(
          '<:shMiscTickError:653815214541766656> • Mensaje borrado en ' +
            message.channel.name
        )
        .addField(
          '> Usuario:',
          `<@${message.author.id}> \`(${message.author.id})\``
        );

      if (message.content) {
        embed.addField('> Mensaje:', message.content);
      }
      if (message.attachments.size > 0) {
        const urls = message.attachments
          .map(
            r =>
              `[${r.filename}](https://media.discordapp.net/attachments/${message.channel.id}/${r.id}/${r.filename})`
          )
          .join(',\n');
        embed.addField('> Archivos:', `${urls}`);
      }
      this.client.channels
        .get(this.client.config.servidor.categorias.staff.canales.logs)
        .send({ embed });
    } catch (e) {
      console.error(e);
    }
  }
};
