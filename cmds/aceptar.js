const playgroundChannelId = require("../config/index.json").chan.playgroundChannelId;
const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: No posees los permisos necesarios.");

  // Obtiene y comprueba si el bot mencionado está en el servidor.
  let userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();

  if (!userBot) return msg.channel.send(":x: **El bot que intentas buscar no está en el servidor**.");

  if (!userBot.user.bot) return msg.channel.send(":x: **El usuario que mencionaste no es un bot**.");

  // Obtiene el bot de la base de datos o club.
  let dbBot = await client.db.bots.findOne({ _id: userBot.id }).exec();

  // Comprueba si está en el club.
  if (!dbBot) return msg.channel.send(":x: **Este bot no está registrado en el club de bots**.");

  // Comprueba si no está en fase de solicitud
  if (dbBot.approvedDate !== 0) return msg.channel.send(`:x: **Este bot no está en fase de solicitud**, fue aprobado el día **${new Date(dbBot.approvedDate).toLocaleDateString()}** a las **${new Date(dbBot.approvedDate).toLocaleTimeString()}** hora GMT (UTC).`);

  // Coloca la fecha de aprobación y cambia la posición de la cola de espera de todos los bots.
  dbBot.approvedDate = Date.now();
  let queue = await client.db.bots.find({ approvedDate: 0 }).exec();
  queue
    .slice(queue.findIndex((bot) => bot.queuePosition === dbBot.nQueue) + 1)
    .sort((a, b) => a.queuePosition - b.queuePosition)
    .forEach(async (bot) => {
      let queueDbBot = await client.db.bots.findOne({ _id: bot.id }).exec();
      queueDbBot.nQueue -= 1;
      queueDbBot.save();
    });

  // Por último se quita el bot de la lista de espera y se guarda todo.
  dbBot.nQueue = 0;
  dbBot.save();

  // Se agregan y se quitan roles del bot para que esté en el club de bots.
  userBot.removeRole(msg.guild.roles.find(r => r.name === "ToTest"));
  userBot.addRole(msg.guild.roles.find(r => r.name === "Club de Bots"));

  // Se crea y se envía un mensaje con un Embed indiciándole a todos que hay un nuevo bot en el club de bots.
  let embed = new RichEmbed()
    .setTitle("¡Nuevo bot en el club de bots!")
    .setDescription(`**◈ Prefijo**: ${dbBot.prefix}\n**◈ Dueño**: ${msg.guild.members.get(dbBot.ownerId).toString()}`)
    .setColor(0x01abb6)
    .setImage(userBot.user.displayAvatarURL)
    .setFooter("Script Hub")
    .setTimestamp();

  client.channels.get(playgroundChannelId).send(embed).catch(() => { });

  // Se envía un mensaje Embed al dueño de que el bot ha sido aceptado correctamente.
  embed = new RichEmbed()
    .setColor(0x049c60)
    .addField("¡Bot aprobado!", `Tu bot **${userBot.user.tag}** es ahora parte del club de bots de Script Hub, verifica el canal <#${playgroundChannelId}>, puedes utilizar \`s!infobot\` para ver información relacionada con tu bot guardada en el club y ya puedes empezar a usar tu bot!`)
    .setThumbnail(userBot.user.displayAvatarURL)
    .setImage("https://i.imgur.com/D56tkxB.png")
    .setFooter("Equipo de aprobaciones de aplicaciones")
    .setTimestamp();

  client.users.get(dbBot.ownerId).send(embed).catch(() => { });
}

exports.aliases = [];
exports.public = false;
exports.description = "Acepta el bot como nuevo miembro del club de bots.";
exports.usage = "s!aceptar Mención-ID";
