require('dotenv').config()
const partnersChannelId = process.env.partnersChannelId;
const { RichEmbed } = require("discord.js");
const colorsEmbed = {
  twitch: 0x6441a5,
  youtube: 0xc4302b,
  discord: 0x7289da
};
// Bot Modules
const errorLog = require("../bot_modules/errorLog.js")

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(":x: No posees los permisos necesarios.");

  // Redefinimos los argumentos.
  args = args.join(" ").split("|").map(arg => arg.trim());

  // Comprueba el tipo de patrocinio.
  if (!args[0]) return msg.channel.send(":x: **Especifica un tipo de patrocinio**.");
  if (args[0].toLowerCase() != "discord" && args[0].toLowerCase() != "twitch" && args[0].toLowerCase() != "youtube") return msg.channel.send(":x: **Categoría inexistente**.");

  // Comprueba la existencia del usuario en el servidor.
  if (!msg.guild.members.get(args[1]))
    return msg.channel.send(":x: **El ID del usuario introducido no existe**.");

  // Comprueba el título.
  if (!args[2]) return msg.channel.send(":x: **Especifica el título**.");

  // Comprueba la descripción.
  if (!args[3]) return msg.channel.send(":x: **Especifica la descripción**.");

  // Comprueba la dirección URL del patrocinio.
  if (!args[4]) return msg.channel.send(":x: **Especifica una URL**.");

  // Comprueba la imagen del patrocinio.
  if (!args[5]) return msg.channel.send(":x: **Especifica una imagen**.");

  // Creamos el Embed para ser posteriormente enviado en el canal de patrocinios.
  let embed = new RichEmbed()
    .setTitle(args[2])
    .setDescription(args[3])
    .setURL(args[4])
    .setColor(colorsEmbed[args[0].toLowerCase()])
    .setFooter("Partner verificado", "https://cdn.discordapp.com/emojis/632377244232318986.png?v=1")
    .setThumbnail(args[5]);

  client.channels.get(partnersChannelId).send(":small_orange_diamond: **Patrocinado por:** <@" + args[1] + ">\n" + args[4], embed);
}

exports.aliases = [];
exports.public = false;
exports.description = "Envía un patrocinio.";
exports.usage = "s!partner Patrocinio|UsuarioID|Título|Descripción|URL|Imagen";
