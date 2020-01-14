let { RichEmbed } = require('discord.js');
module.exports = class MessageUpdateEvent {
  constructor(client) {
    this.client = client;
  }
  async run(oldMessage, newMessage) {
    if (oldMessage == newMessage) return;
    if (oldMessage.content === newMessage.content) return;
    this.client.emit('message', newMessage);
    const embed = new RichEmbed()
      .setColor(0xf1c40f)
      .setTitle(
        '<:shMiscTickY:659827689930096673> • Mensaje editado en ' +
          oldMessage.channel.name
      )
      .addField(
        '> Usuario:',
        `<@${oldMessage.author.id}> \`(${oldMessage.author.id})\``
      )
      .addField(
        '> Antes',
        oldMessage.content,
        oldMessage.content.lenght < 16 ? true : false
      )
      .addField('> Después', newMessage.content, true);
    this.client.channels
      .get(this.client.config.servidor.categorias.staff.canales.logs)
      .send({ embed });
    try {
    } catch (e) {
      console.error(e);
    }
  }
};
