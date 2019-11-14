const projectsChannelId = require("../config/index.json").chan.projectsChannelId;
const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  // Redefinimos los argumentos.
  args = args.join(" ").split("|").map(arg => arg.trim());

  // Comprueba si los argumentos pueden ser una ID de mensaje para la eliminación de un proyecto.
  if (args[0] && args[0].startsWith("del:") && parseInt(args[0].slice(4)) && String(parseInt(args[0].slice(4))).length === 18) {
    let projectMsg = await client.channels.get(projectsChannelId).fetchMessage(args[0].slice(4));
    if (!projectMsg.embeds[0].footer.text.includes(`ID: ${msg.author.id}`)) return msg.channel.send(`:x: **El proyecto \`${projectMsg.embeds[0].author.name}\` no es de tu propiedad o no es válido**.`);
    projectMsg.delete();
    return msg.channel.send(`Proyecto \`${projectMsg.embeds[0].author.name}\` eliminado correctamente`);
  }

  // Comprueba el nombre.
  if (!args[0]) return msg.channel.send(":x: **Especifica un nombre para el proyecto**.");

  if (args[0].length > 20) return msg.channel.send(":x: **El nombre no debe superar los 20 caractéres**.");

  // Comprueba los lenguajes.
  if (!args[1]) return msg.channel.send(":x: **Especifica uno o más lenguajes para el proyecto**.");

  // Comprueba las librerias.
  if (!args[2]) return msg.channel.send(":x: **Especifica las librerías utilizadas en el proyecto**.");

  // Comprueba la descripción.
  if (!args[3]) return msg.channel.send(":x: **Especifica una descripción para el proyecto**.");

  if (args[3].length > 200) return msg.channel.send(":x: **La descripción no debe superar los 200 caractéres**.");

  // Comprueba el progreso.
  if (!args[4]) return msg.channel.send(":x: **Especifique el progreso del proyecto**.");

  if (parseInt(args[4]) === NaN) return msg.channel.send(":x: **El progreso debe ser especificado en formato numérico**.");

  if (parseInt(args[4]) < 0 || parseInt(args[4]) > 100) return msg.channel.send(":x: **El progreso debe estar entre 1 y 100**.");

  // Comprueba la dirección URL del proyecto.
  if (!args[5]) return msg.channel.send(":x: **Especifica un repositorio de GitHub o una dirección URL hacia el proyecto**.");

  // Generando un Embed para posteriormente enviar el Embed con el proyecto al canal.
  const embed = new RichEmbed()
    .setDescription(`**Descripción:** ${args[3]}\n**Lenguaje(s):** ${args[1]}\n**Librería(s):** ${args[2]}\n**Progreso:** ${args[4]}%\n**Repositorio:** ${args[5]}`)
    .setColor(0x36393e)
    .setAuthor(args[0], client.user.displayAvatarURL)
    .setThumbnail(msg.author.displayAvatarURL)
    .setFooter(`Autor: ${msg.author.tag} (ID: ${msg.author.id})`);
    
  client.channels.get(projectsChannelId).send(embed);
}

exports.aliases = [];
exports.public = true;
exports.description = "Registra un proyecto y compártelo con la comunidad.";
exports.usage = "s!project Nombre|Lenguajes|Librerías|Descripción|Progreso|URL";
