const {RichEmbed} = require('discord.js');

exports.run = async (client, msg, args) => {
  // Crea el Embed con una información predefinida.
  const embedOTA = new RichEmbed()
      .setColor('#00EBB0')
      .setTitle('Reporta errores y contribuye. Sé parte de Script Hub.')
      .setDescription('**Script Hub Bot** es uno de los proyectos **open source** de Script Hub que es publicado gracias al equipo de desarrolladores sin ánimos de lucro de **Script Hub OTA**. \n<:scripthub:646177532365897730> [¡Contribuye libremente con nosotros y aprende!](https://github.com/scripthubteam)')
      .setThumbnail('https://i.imgur.com/xtkteHF.png');


  // Definimos una variable de salida y por cada comando público, lo listamos en esa variable para ser colocado en el Embed.
  let outPublic = '';
  client.cmds.filter((cmd) => cmd.public).forEach((cmd) => {
    outPublic += `**[${cmd.usage.trim()}](https://scripthubteam.github.io/)** - ${cmd.description.trim()}\n`;
  });

  // Comandos privados al MD del personal autorizado.
  if (msg.member.hasPermission('MANAGE_GUILD')) {
    // Definimos una variable de salida y por cada comando privado/no público, lo listamos en esa variable para ser colocado en el Embed.
    let outPrivate = '';
    client.cmds.filter((cmd) => !cmd.public).array().forEach((cmd) => {
      outPrivate += `**[${cmd.usage.trim()}](https://scripthubteam.github.io/)** - ${cmd.description.trim()}\n`;
    });

    const embedServer = new RichEmbed()
        .setTitle('Lista de comandos')
        .setDescription(outPublic)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(0x36393e)
        .setFooter(msg.author.tag, msg.author.displayAvatarURL);
    // Se coloca un título y descripción diferente para los privados.
    const embedPrivate = new RichEmbed()
        .setTitle('Panel de Administración')
        .setDescription(outPrivate)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(0x36393e)
        .setFooter(msg.author.tag, msg.author.displayAvatarURL);

    msg.author.send(embedPrivate);
    msg.channel.send(embedServer);
    msg.channel.send(embedOTA);
  };
};
exports.aliases = [];
exports.public = false;
exports.description = 'Muestra la ayuda.';
exports.usage = 's!help';
