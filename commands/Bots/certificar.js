const Command = require("../../base/Command.js");

module.exports = class Bots extends Command {
  constructor(client) {
    super(client, {
      name: "certificar",
      description: 'Certifica un bot como "Confiable" del club de bots.',
      usage: prefix => `\`${prefix}certificar <Bot>\``,
      examples: prefix => `\`${prefix}certificar Ginko\``,
      enabled: true,
      ownerOnly: true,
      guildOnly: false,
      aliases: ["verificar", "verify"],
      memberPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data) {
    try {
      if (!args[0]) {
        return message.channel.send(
          ":x: | Necesitas especificar el bot a certificar."
        );
      } else {
        let bot =
          message.mentions.members.first() ||
          message.guild.members.find(x =>
            `${x.displayName}${x.user.tag}`
              .toLowerCase()
              .includes(args[0].toLowerCase())
          ) ||
          message.guild.members.get(args[0]);
        if (!bot || !bot.user.bot) {
          return message.channel.send(":x: | Necesitas elegir a un bot");
        } else {
          let databot = await this.client.botsys.findOrCreateBot({
            id: bot.user.id
          });
          if (!databot.accepted || !databot.invited || !databot.info) {
            return message.channel.send(
              ":x: | Necesita ser un bot del Club de Bots."
            );
          } else {
            let embedDev = new (require("discord.js").RichEmbed)()
              .setColor(this.client.colors.hub)
              .setThumbnail(member.user.displayAvatarURL)
              .setTitle("¡Bot certificado!")
              .setDescription(
                'Tu bot ha sido certificado como "Confiable" dentro del Club de Bots.'
              );
            this.client.users
              .get(databot.info.ownerID)
              .send({ embed: embedDev });
            let embed = new (require("discord.js").RichEmbed)()
              .setColor(this.client.colors.hub)
              .setThumbnail(bot.user.displayAvatarURL)
              .setTitle("¡Bot certificado!")
              .setDescription("El bot se ha certificado correctamente.");
            message.channel.send({ embed: embed });
            databot.info.verified = true;
            await databot.save();
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
