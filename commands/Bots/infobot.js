const Command = require("../../base/Command.js");

module.exports = class Bots extends Command {
  constructor(client) {
    super(client, {
      name: "infobot",
      description:
        "Mira la información de un bot y vota por él, si eres el dueño, puedes cambiar información del bot.",
      usage: prefix =>
        `\`${prefix}infobot <Bot> [<<votar [<up | down>]> | <prefijo [<nuevo prefijo>]> | <descripción [<nueva descripción>]>>]\``,
      examples: prefix => `\`${prefix}infobot Ginko votar up\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: true,
      aliases: [],
      memberPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      if (!args[0]) {
        return message.channel.send(":x: | Necesitas mencionar a un bot");
      } else {
        let options = ["votar", "prefijo", "descripción"];
        let member =
          message.mentions.members.first() ||
          message.guild.members.find(x =>
            `${x.displayName}${x.user.tag}`
              .toLowerCase()
              .includes(args[0].toLowerCase())
          ) ||
          message.guild.members.get(args[0]);
        let botDBExists = await this.client.botsys.botExists(member.user.id);
        if (!botDBExists) {
          message.channel.send(":x: | Este bot no existe en la base de datos.");
        } else {
          let bot = await this.client.botsys.findOrCreateBot({
            id: member.user.id
          });
          let owner = await this.client.fetchUser(bot.info.ownerID);
          if (!args[1]) {
            let state = bot.invite.state,
              State;
            if (state === 0) {
              State = "Esperando aprobación...";
            } else if (state === 1) {
              State = "Aceptado";
            } else if (state === 2) {
              State = "Denegado";
            } else {
              State = "Otro";
            }
            let embed = new (require("discord.js").RichEmbed)()
              .setColor(this.client.colors.hub)
              .setTitle(
                (bot.info.verified
                  ? "<:shIconVerificado:632377244232318986> "
                  : "") + member.displayName
              )
              .setThumbnail(member.user.displayAvatarURL)
              .setDescription(
                "Si quieres votar o actualizar la información de tu bot elige una opción\nOpciones: `" +
                options.join("`, `") +
                "`"
              )
              .addField("Descripción", bot.info.description)
              .addField(
                "Prefijo",
                "`" + (bot.info.prefix ? bot.info.prefix : "No tiene") + "`",
                true
              )
              .addField(
                "Votos",
                "**<:shMiscVoteUp:653872059641757802> `" +
                bot.info.votes.up +
                " `\n<:shMiscVoteDown:653872059675574272> `" +
                bot.info.votes.down +
                " `**",
                true
              )
              .addField("Estado", State)
              .addField("Dueño/a", owner.tag);
            message.channel.send({ embed });
          } else if (args[1].toLowerCase() === options[0]) {
            let votes = ["up", "down"];
            if (!args[2]) {
              return message.channel.send(
                ":x: | Necesitas elegir una opción\nOpciones: `" +
                votes.join("`, `") +
                "`"
              );
            } else if (args[2].toLowerCase() === votes[0]) {
              if (bot.info.votes.voters.includes(message.author.id)) {
                return message.channel.send(
                  ":x: | Ya has votado por este bot."
                );
              } else {
                message.channel.send(
                  "<:shMiscVoteUp:653872059641757802> | Haz votado positivamente por este bot."
                );
                bot.info.votes.up += 1;
                bot.info.votes.voters.push(message.author.id);
                await bot.save();
              }
            } else if (args[2].toLowerCase() === votes[1]) {
              if (bot.info.votes.voters.includes(message.author.id)) {
                return message.channel.send(
                  ":x: | Ya has votado por este bot."
                );
              } else {
                message.channel.send(
                  "<:shMiscVoteDown:653872059675574272> | Haz votado negativamente por este bot."
                );
                bot.info.votes.down += 1;
                bot.info.votes.voters.push(message.author.id);
                await bot.save();
              }
            } else {
              return message.channel.send(
                ":x: | Necesitas elegir una opción válida\nOpciones: `" +
                votes.join("`, `") +
                "`"
              );
            }
          } else if (args[1].toLowerCase() === options[1]) {
            if (
              message.author.id !== bot.info.ownerID &&
              !message.author.roles.has(
                this.client.config.servidor.roles.staff.departamento.comunidad
              )
            ) {
              return message.channel.send(
                ":x: | Si no eres el dueño del bot o miembro del personal no podrás editar la información del bot."
              );
            } else {
              message.channel.send(
                ":white_check_mark: | El prefijo se ha editado correctamente.\nNuevo Prefijo: `" +
                args[2] +
                "`"
              , { disableEveryone: true });
              bot.info.prefix = args[2];
              await bot.save();
            }
          } else if (args[1].toLowerCase() === options[2]) {
            if (
              message.author.id !== bot.info.ownerID &&
              !message.author.roles.has(
                this.client.config.servidor.roles.staff.departamento.comunidad
              )
            ) {
              return message.channel.send(
                ":x: | Si no eres el dueño del bot o miembro del personal no podrás editar la información del bot."
              );
            } else {
              message.channel.send(
                ":white_check_mark: | La descripción se ha editado correctamente.\nNueva Descripción:\n`" +
                args.slice(2).join(" ") +
                "`"
              , { disableEveryone: true });
              bot.info.description = args.slice(2).join(" ");
              await bot.save();
            }
          } else {
            return message.channel.send(
              ":x: | Necesitas elegir una opción válida\nOpciones: `" +
              options.join("`, `") +
              "`"
            );
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
