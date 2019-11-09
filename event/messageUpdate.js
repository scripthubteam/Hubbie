const Discord = require("discord.js");
module.exports = async (bot, oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (oldMessage == newMessage) return;
  if (oldMessage.content === newMessage.content) return;
  if (!newMessage.used) {
    bot.emit("message", newMessage);
  }

  const embed1 = new Discord.RichEmbed()
    .setDescription("Mensaje borrado en " + oldMessage.channel.toString())
    .addField("> Usuario:", `<@${oldMessage.author.id}> \`(${oldMessage.author.id}\`)`)
    .addField("> Antes", oldMessage.content, oldMessage.content.lenght < 16 ? true : false)
    .addField("> Después", newMessage.content, true);

  let channel = bot.channels.get("606340576740114433");

  if (channel) await channel.send(embed1);
};
