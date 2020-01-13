module.exports = class Event {
  constructor(client) {
    this.client = client;
  }
  async run() {
    try {
      console.log(
        this.client.user.tag +
          ' (' +
          this.client.config.bot.prefix +
          ') - ¡Listo!'
      );
      this.client.user.setActivity('Documentación y bots', {
        type: 'WATCHING'
      });
    } catch (e) {
      console.error(e);
    }
  }
};
