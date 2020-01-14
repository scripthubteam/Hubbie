let { RichEmbed } = require("discord.js");
module.exports = class GuildMemberAddEvent {
  constructor(client) {
    this.client = client;
  }
  async run(member) {
    try {
      let servidor = this.client.config.servidor;
      if (member.user.bot) {
        let bot = await this.client.botsys.findOrCreateBot({ id: member.id });
        if (bot.invited) {
          member.addRole(servidor.roles.bots.test);
          this.client.channels
            .get(servidor.categorias.staff.canales.logs)
            .send(
              "[Bot] **" +
              member.user.tag +
              "** ha sido invitado y requiere de aprobación"
            );
        } else {
          member.addRole(servidor.roles.bots.gen);
          this.client.channels
            .get(servidor.categorias.staff.canales.logs)
            .send("[Bot] **" + member.user.tag + "** ha entrado al servidor");
        }
      } else {
        const embed = new RichEmbed()
          .setColor(this.client.colors.hub)
          .setTitle(`¡Bienvenido/a ${member.displayName}!`)
          .setDescription(
            `Gracias por unirte a **${member.guild.name}**.\n~ Lee <#${servidor.categorias.info.canales.intro}> para empezar tu recorrido por el servidor.\n~ Lee <#${servidor.categorias.info.canales.rules}> para seguir el fundamento del servidor.\n~ ¿Necesitas ayuda? Consulta tus dudas en la categoría <#${servidor.categorias.langs.id}>.`
          )
          .setFooter(`Usuario número: #${member.guild.memberCount}`)
          .setImage(
            "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/86d67988638009.5ddc82b1376d3.jpg"
          );
        member.addRole(servidor.roles.comunidad.usuario);
        this.client.channels
          .get(servidor.categorias.comunidad.canales.global)
          .send(member.user.toString(), { embed: embed });
        this.client.channels
          .get(servidor.categorias.staff.canales.logs)
          .send("[Común] **" + member.user.tag + "** ha entrado al servidor");
      }
    } catch (e) {
      console.error(e);
    }
  }
};
