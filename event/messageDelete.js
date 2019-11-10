const Discord = require("discord.js")
module.exports = async (bot, msg) => {
  const embed = new Discord.RichEmbed()
    .setDescription("Mensaje borrado en " + msg.channel.toString())
    .addField("> Usuario:", `<@${msg.author.id}> \`(${msg.author.id}\`)`);

  if (msg.content) {
    embed.addField("> Mensaje:", msg.content);
  }

  if (msg.attachments.size > 0) {
    let urls = msg.attachments
      .map(r => `https://media.discordapp.net/attachments/${msg.channel.id}/${r.id}/${r.filename}`)
      .join("\n");

    embed.addField("> Archivos:", `${urls}`);
  }

  let channel = bot.channels.get("606340576740114433");
  channel.send({ embed });
<<<<<<< HEAD
};
=======
};
>>>>>>> 07207051492aebc6b3bd5850cf0c206cc41b5609
