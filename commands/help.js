const {RichEmbed} = require('discord.js');

exports.run = async (client, msg, args) => {
  // Verifica si se introdujo un comando.
  if(client.cmds.get(args[0])){
    const embedHelpCMD = new RichEmbed()
    .setColor("#F7671E")
    .setTitle(args[0])
    .setFooter(msg.author.tag, msg.author.displayAvatarURL)
    .setDescription("> Alias: `"+client.cmds.get(args[0]).aliases.join(", ")+"`")
    .addField("Descripción", client.cmds.get(args[0]).description.trim())
    .addField("Ejemplo de uso", client.cmds.get(args[0]).usage.trim())
    if(!client.cmds.get(args[0]).public){
      embedHelpCMD.addField("Comando administrativo", "> Este comando sólo puede ser usado por miembros del equipo de **Script Hub**.")
    }
    msg.channel.send(embedHelpCMD);
    return;
  }
  if(args[0]) msg.channel.send("<:shAnimeShrug:607958984854601731> No se ha encontrado el comando `"+args[0]+"` en nuestro registro de comandos. **Revisa la lista de comandos nuevamente, aquí la tienes:**")
  // Crea el Embed con una información predefinida.
  const embedOTA = new RichEmbed()
      .setColor('#00EBB0')
      .setTitle('Reporta errores y contribuye. Sé parte de Script Hub.')
      .setDescription('**Script Hub Bot** es uno de los proyectos **open source** de Script Hub que es publicado gracias al equipo de desarrolladores sin ánimos de lucro de **Script Hub OTA**. \n[¡Contribuye libremente con nosotros y aprende!](https://github.com/scripthubteam)')
      .setThumbnail('https://i.imgur.com/B1YsRel.jpg');

  // Definimos una variable de salida y por cada comando público, lo listamos en esa variable para ser colocado en el Embed.
  let outPublic = '';
  
  const embedServer = new RichEmbed()
        .setTitle('Lista de comandos')
        .setDescription(outPublic)
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(0x36393e)
        .setFooter(msg.author.tag, msg.author.displayAvatarURL);
  
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
  } else {
    msg.channel.send(embedServer);
    msg.channel.send(embedOTA);
  };
};
exports.aliases = [];
exports.public = false;
exports.description = 'Muestra la ayuda.';
exports.usage = 's!help';
