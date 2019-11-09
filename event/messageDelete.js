const Discord = require("discord.js")
module.exports = async (bot, message) => {
  const embed = new Discord.RichEmbed()
    .setDescription("Mensaje borrado en " + message.channel.toString())
    .addField(
      "> Usuario:",
      `<@${message.author.id}> \`(${message.author.id}\`)`
    );

  if (message.content) {
    embed.addField("> Mensaje:", message.content);
  }

  if (message.attachments.size > 0) {
    let urls = message.attachments
      .map(r => `https://media.discordapp.net/attachments/${message.channel.id}/${r.id}/${r.name}`)
      .join("\n");

    embed.addField("> Archivos:", `${urls}`);
  }

  let channel = bot.channels.get("606340576740114433");
  channel.send({ embed });
};
