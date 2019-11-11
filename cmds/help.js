const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  // Crea el Embed con una información predefinida.
  const embed = new RichEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL)
    .setTitle("Lista de comandos públicos")
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
      .setTitle("Lista de comandos privados")
      .setDescription(outPrivate);

    // Se envía el Embed con los comandos privados.
    msg.author.send(embed).catch(() => { });
  }

  // Se coloca la descripción del Embed con la información de comandos públicos.
  embed.setDescription(outPublic);

  // Se envía el Embed con los comandos públicos.
  msg.channel.send(embed);
}

exports.aliases = [];
exports.public = false;
exports.description = "Muestra la ayuda.";
exports.usage = "s!help";
