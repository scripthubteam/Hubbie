const { RichEmbed } = require("discord.js");
// Bot Modules
const errorLog = require("../bot_modules/errorLog.js")

exports.run = async (client, msg, args) => {
  // Crea el Embed con una información predefinida.
  const embedOTA = new RichEmbed()
  .setColor("#00EBB0")
  .setTitle("Reporta errores y contribuye. Sé parte de Script Hub.")
  .setDescription("**Script Hub Bot** es uno de los proyectos **open source** de Script Hub que es publicado gracias al equipo de desarrolladores sin ánimos de lucro de **Script Hub OTA**. \n<:scripthub:646177532365897730> [¡Contribuye libremente con nosotros y aprende!](https://github.com/scripthubteam)")
  .setThumbnail("https://i.imgur.com/xtkteHF.png")

  const embed = new RichEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL)
    .setColor(0x36393e)
    .setFooter(msg.author.tag, msg.author.displayAvatarURL);

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
  msg.channel.send(embed).catch((e) => {errorLog(e)});
  msg.channel.send(embedOTA).catch((e) => {errorLog(e)});
}

exports.aliases = [];
exports.public = false;
exports.description = "Muestra la ayuda.";
exports.usage = "s!help";
