const Command = require("../../base/Command.js");

module.exports = class Mods extends Command {
  constructor(client) {
    super(client, {
      name: "expulsar",
      description: "Expulsa a un miembro del servidor.",
      usage: prefix => `\`${prefix}expulsar <usuario> <razón>\``,
      examples: prefix => `\`${prefix}expulsar UsuarioEjemplo Regla #1.\``,
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      aliases: ["kick"],
      memberPermissions: ["KICK_MEMBERS"],
      dirname: __dirname
    });
  }
  async run(message, args, data) {
    try {
      if (!args[0]) {
        return message.channel.send(":x: | Necesitas mencionar a alguien.");
      } else {
        let member =
          message.mentions.members.first() ||
          message.guild.members.find(x =>
            `${x.displayName}`.toLowerCase().includes(args[0].toLowerCase())
          );
        let dataM = await this.client.findOrCreateMember({
          id: member.id,
          guildID: message.guild.id
        });
        if (!args[1]) {
          return message.channel.send(":x: | Necesitas especificar una razón.");
        } else if (!member) {
          return message.channel.send(":x: | Menciona a alguien válido.");
        } else {
          let id = this.client.functions.makeID();
          let reason = args.slice(1).join(" ");
          let sendChannel = `- El usuario ${member.user.tag} (${member.id}) ha sido expusaldo/a por el/la moderador/a ${message.author.tag}.\n+ Razón: ${reason}\n+ ID del caso: ${id}`;
          let sendMember = `- Has sido expulsado/a del servidor **${message.guild.name}**.\n+ Razón: ${reason}\n+ ID del caso: ${id}\n--- Si crees que esto es un error contacta con algún staff y proporciona la ID de tu caso.`;
          this.client.channels
            .get(this.client.config.servidor.categorias.info.canales.casos)
            .send(sendChannel, { code: "diff" });
          member.send(sendMember, { code: "diff" });
          member.kick(reason);
          let arr = [];
          arr.push({
            mType: "kick",
            mID: id,
            mReason: reason,
            mMod: message.author.id
          });
          dataM.moderation = {
            cases: arr
          };
          await dataM.save();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
};
