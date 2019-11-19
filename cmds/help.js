const { RichEmbed } = require("discord.js");
// Bot Modules
const errorLog = require("../bot_modules/errorLog.js")

exports.run = async (client, msg, args) => {
  // Crea el Embed con una información predefinida.
  const embed = new RichEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL)
    .setColor(0x36393e);

  // Definimos una variable de salida y por cada comando público, lo listamos en esa variable para ser colocado en el Embed.
  let outPublic = "";
  client.cmds.filter((cmd) => cmd.public).array().forEach((cmd) => {
    outPublic += `**[${cmd.usage.trim()}](https://scripthubteam.github.io/)** - ${cmd.description.trim()}\n`;
  });

  // Comandos privados al MD del personal autorizado.
  if (msg.member.hasPermission("MANAGE_GUILD")) {
    // Definimos una variable de salida y por cada comando privado/no público, lo listamos en esa variable para ser colocado en el Embed.
    let outPrivate = "";
    client.cmds.filter((cmd) => !cmd.public).array().forEach((cmd) => {
      outPrivate += `**[${cmd.usage.trim()}](https://scripthubteam.github.io/)** - ${cmd.description.trim()}\n`;
    });

    // Se coloca un título y descripción diferente para los privados.
    embed
      .setTitle("Panel de Administración")
      .setDescription(outPrivate);

    // Se envía el Embed con los comandos privados.
    msg.author.send(embed).catch((e) => {errorLog(e)});
  }

  // Se coloca la descripción del Embed con la información de comandos públicos.
  embed.setTitle("Lista de comandos")
  embed.setDescription(outPublic);

  // Se envía el Embed con los comandos públicos.
  msg.channel.send(embed);
}

exports.aliases = [];
exports.public = false;
exports.description = "Muestra la ayuda.";
exports.usage = "s!help";
