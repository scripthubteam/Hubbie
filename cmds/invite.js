require('dotenv').config()
const inviteChannelId = process.env.inviteChannelId;
const botRequestsChannelId = process.env.botRequestsChannelId;
const { RichEmbed } = require("discord.js");
// Bot Modules
const errorLog = require("../bot_modules/errorLog.js")

exports.run = async (client, msg, args) => {
  // Solamente se puede invitar desde el canal de invitaciones.
  if (msg.channel.id !== inviteChannelId) return;

  // Verifica si tiene un ID válido.
  if (!args[0]) return msg.channel.send(":x: **Esa no es una ID válida**. La ID debe ser el identificador de la aplicación del bot.");

  try {
    // Obtenemos el usuario del bot y si no se encuentra envía mensaje de error.
    let userBot = await client.fetchUser(args[0]);
    // Comprueba si existía ya en la base de datos (club de bots).
    let dbBot = await client.db.bots.findOne({ botId: userBot.id }).exec();
    if (dbBot) return msg.channel.send(":x: **Este bot ya ha sido invitado**.");

    // Comprueba si no es un bot.
    if (!userBot.bot) return msg.channel.send(":x: **La ID introducida no pertenece a un bot**.");

    //  Comprueba si colocó un prefijo para el bot.
    if (!args[1]) return msg.channel.send(":x: **Por favor, especifica un prefix para tu bot**. El prefix ayudará a saber cómo se ejecuta tu bot.");

    // Obtenemos los bots actuales en la lista de espera y creamos el bot en la base de datos con esa posición.
    let queue = await client.db.bots.find({ approvedDate: 0 }).exec();
    dbBot = new client.db.bots({
      botId: userBot.id,
      ownerId: msg.author.id,
      prefix: args[1],
      nQueue: queue.length + 1
    });

    // Guardamos todo lo anteriormente escrito.
    await dbBot.save();

    // Enviamos un Embed al canal de invitaciones.
    let embed = new RichEmbed()
      .setTitle("Solicitud de invitación")
      .setDescription(`¡Hola **${msg.author.tag}**! Gracias por invitar tu bot a **Script Hub**, este será en lo más breve posible introducido al servidor si cumple los requisitos. Te enviaremos una notificación cuando se decida sobre tu solicitud.`)
      .addField("🤖 Bot", userBot.tag, true)
      .addField("ℹ Prefix", `\`${args[1]}\``, true)
      .addField("💻 Desarrollador", msg.author.tag, true)
      .setThumbnail(userBot.displayAvatarURL)
      .setColor(0x000000)
      .setFooter("Petición generada", msg.author.displayAvatarURL)
      .setTimestamp();

    msg.channel.send(embed);

    // Editamos el Embed y después lo enviamos al canal del personal que revisa los bots.
    embed
      .setDescription(`El usuario **${msg.author.tag}** ha solicitado que su bot **${userBot.tag}** sea invitado a **Script Hub**.\n[CLICK PARA INVITAR AQUÍ](https://discordapp.com/api/oauth2/authorize?client_id=${userBot.id}&permissions=0&scope=bot&guild_id=${msg.guild.id})`)
      .setFooter("Detalles de la petición");

    client.channels.get(botRequestsChannelId).send(":information_source: Para rechazar una solicitud, utilice `s!denegar <ID>`", embed).catch((e) => {errorLog(e)});

    // Enviamos un Embed al autor (desarrollador del bot).
    embed = new RichEmbed()
      .setImage("https://i.imgur.com/D56tkxB.png")
      .setTitle("Su solicitud está pendiente de aprobación")
      .setDescription(`Le notificamos que su bot **${userBot.tag}** está pendiente de ser aprobado o ser rechazado a la brevedad. Su puesto en la cola de espera es **${dbBot.nQueue}**.`)
      .setColor(0x000000)
      .setFooter("Equipo de Administración General")
      .setTimestamp();

    msg.author.send(embed).catch((e) => {errorLog(e)});
  } catch (e) {
    // Mensaje de error por si el usuario no existe o pasa algo erróneo o no esperado, que por lo general es que la ID no es válida.
    console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
    errorLog(e);
    msg.channel.send(":x: **Esa no es una ID válida**. La ID debe ser el identificador de la aplicación del bot.");
  }
}

exports.aliases = ['inv'];
exports.public = true;
exports.description = "Invita a tu bot.";
exports.usage = "s!invite ID Prefix";
