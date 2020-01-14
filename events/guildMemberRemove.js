module.exports = class GuildMemberRemoveEvent {
  constructor(client) {
    this.client = client;
  }
  async run(member) {
    try {
      let { RichEmbed } = require("discord.js");
      let canal = await this.client.channels.get(
        this.client.config.servidor.categorias.staff.canales.logs
      );
      let playground = await this.client.channels.get(
        this.client.config.servidor.categorias.bots.canales.playground
      );
      let guild = await this.client.findOrCreateGuild({ id: member.guild.id });
      if (member.user.bot) {
        let bot = await this.client.botsys.getBot(member.user.id);
        if (await this.client.botsys.botExists(member.user.id) === true) {
          if (bot.invite.state === 0) {
            playground.send("> El bot **" + member.user.tag + "** no fue aprobado y fue expulsado.")
            guild.botQueue -= 1;
            let noACEmbed = new RichEmbed()
              .setColor(this.client.colors.red)
              .setTitle("Petición rechazada sin motivo.")
              .setThumbnail(member.user.displayAvatarURL)
              .setDescription(
                "Tu bot ha sido rechazado por un inspector o un administrador global.\nEn este caso, necesitarás pedir motivos a un miembro del `Departamento de Comunidad`.")
              .addField("Bot", `<@${member.user.id}>`, true)
              .addField(
                "Desarrollador/a",
                `<@${bot.info.ownerID}>`,
                true
              );
            let owner = this.client.users.get(bot.info.ownerID);
            let msg = await this.client.channels.get(this.client.config.servidor.categorias.bots.canales.invitar).fetchMessage(bot.invite.messageID);
            await msg.edit({ embed: noACEmbed });
            owner.send(noACEmbed)
            guild.save()
            await this.client.botsys.deleteBot(member.user.id);
            return;
          }
          playground.send(
            "> El bot **" +
            member.user.tag +
            "** fue expulsado del **Club de Bots**."
          );
          this.client.botsys.deleteBot(member.user.id);
          return;
        }
        return;
      }
      canal.send(
        `[${member.user.bot ? `Bot` : `Común`}] **${
        member.user.tag
        }** ha salido del servidor.`
      );
    } catch (e) {
      console.error(e);
    }
  }
};
