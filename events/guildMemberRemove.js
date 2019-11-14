require('dotenv').config()
const privateLogsChannelId = process.env.privateLogsChannelId;
const playgroundChannelId = process.env.playgroundChannelId;
const { RichEmbed } = require("discord.js");

module.exports = async (client, member) => {
  // Comprueba si es un bot y hace lo siguiente.
  if (member.user.bot) {
    // Comprueba si el bot existe o está en el club de bots.
    let dbBot = await client.db.bots.findOne({ botId: member.id }).exec();
    if (!dbBot) return client.channels.get(privateLogsChannelId).send(`:robot: **[COMÚN] ${member.user.username}** salió del servidor.`);

    // Creamos el Embed el cual informa al dueño que su bot ha sido expulsado del club de bots.
    let embed = new RichEmbed()
      .setColor(0x000000)
      .setTimestamp(new Date())
      .setFooter("Equipo de aprobación de aplicaciones")
      .setImage("https://i.imgur.com/D56tkxB.png")
      .addField(":x: Su bot fue expulsado de Script Hub.", `El bot **${member.user.tag}** fue eliminado del club de bots.\n¿Esto es un error? Por favor contacta a un administrador.`);

    // Le envimos el embed al dueño o desarrollador del bot solo si no está aprobado.
    if (!client.onlyDeleteUsers.includes(member.id)) client.users.get(dbBot.idOwner).send(embed).catch(() => { });

    // Se le informa al personal por medio del canal de logs que el bot no hace parte del club de bots ahora.
    client.channels.get(privateLogsChannelId).send(`:robot: **[CLUB DE BOTS] ${member.user.tag}** salió del servidor por no formar parte del **club de bots**.`).catch(() => { });

    // Se le informa a todos los usuarios mediante el canal playground que el bot no pertecene más al club solo si no está aprobado.
    if (!client.onlyDeleteUsers.includes(member.id)) client.channels.get(playgroundChannelId).send(`:robot: El bot **${member.user.tag}** no pertenece más al **club de bots**.`).catch(() => { });

    // Por último, se elimina el bot del club de bots por su salida.
    await client.db.bots.deleteOne({ botId: member.id });
    if (client.onlyDeleteUsers.includes(member.id)) client.onlyDeleteUsers.splice(client.onlyDeleteUsers.indexOf(member.id), 1);

    // Si no es bot, se envía un mensaje de salida de un usuario al canal del personal del servidor.
  } else client.channels.get(privateLogsChannelId).send(`**[USER] ${member.user.tag}** salió del servidor.`);
}