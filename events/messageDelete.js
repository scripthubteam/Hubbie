const privateLogsChannelId = require("../config/index.json").chan.privateLogsChannelId;
const { RichEmbed } = require("discord.js");

module.exports = async (client, msg) => {
  // Se crea un Embed base con el autor del mensaje.
  let embed = new RichEmbed()
    .setDescription("Mensaje borrado en " + msg.channel.toString())
    .addField("> Usuario:", `<@${msg.author.id}> \`(${msg.author.id}\`)`);

  // Si hay mensaje o el mensaje es mayor a uno, lo coloca en el Embed.
  if (msg.content && msg.content.length > 1) {
    embed.addField("> Mensaje:", msg.content);
  }

  // Si hay archivos adjuntos en el mensaje se colocan.
  if (msg.attachments.size > 0) {
    // Se colocan de la siguiente forma [archivo.adjunto](url), [archivo](url).
    let urls = msg.attachments.map(r => `[${r.filename}](https://media.discordapp.net/attachments/${msg.channel.id}/${r.id}/${r.filename})`).join(", ");

    // Se agregan al Embed.
    embed.addField("> Archivos:", `${urls}`);
  }

  // Se envía el Embed al registro privado.
  client.channels.get(privateLogsChannelId).send(embed).catch(() => { });
}