const { privateLogsChannelId } = require("../channelsConfig.json");
const { RichEmbed } = require("discord.js");

module.exports = async (client, oldMessage, newMessage) => {
  // Condiciones fundamentales por si el mensaje tiene embed y se "edita".
  if (oldMessage == newMessage) return;
  if (oldMessage.content === newMessage.content) return;

  // Se crea el Embed con el contenido anterior y el actual.
  let embed = new RichEmbed()
    .setDescription("Mensaje editado en " + oldMessage.channel.toString())
    .addField("> Usuario:", `<@${oldMessage.author.id}> \`(${oldMessage.author.id}\`)`)
    .addField("> Antes", oldMessage.content, oldMessage.content.lenght < 16 ? true : false)
    .addField("> Después", newMessage.content, true);

  // Se envía el Embed al canal del registro privado.
  client.channels.get(privateLogsChannelId).send(embed).catch(() => { });
}