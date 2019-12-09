const privateLogsChannelId = process.env.privateLogsChannelId;
const {RichEmbed} = require('discord.js');

const BotManager = require('../lib/BotManager');
const botManager = new BotManager();

exports.run = async (client, msg, args) => {
  // Obtiene y comprueba si el bot mencionado está en el servidor.
  const userBot = msg.mentions.members.first();

  if (!userBot) return msg.channel.send(':x: **El bot que intentas buscar no está en el servidor**.');

  if (!userBot.user.bot) return msg.channel.send(':x: **El usuario que mencionaste no es un bot**.');
  const BOT_ID = userBot.id;
  const OWNER_ID = await botManager.getOwner(BOT_ID);
  const userOwner = msg.guild.members.get(OWNER_ID);

  // Comprueba si está en el club.
  if (!await botManager.botExists(BOT_ID)) return msg.channel.send(':x: **Este bot no está registrado en el club de bots**.');

  // Comprueba si el dueño está dentro del servidor.
  if (!userOwner) {
    return client.channels.get(privateLogsChannelId).send(`Se ha detectado que el usuario <@${OWNER_ID}> abandonó el servidor y su bot **${userBot.tag}** está en el servidor. **ESTO AMERITA UN KICK A LA APLICACIÓN**.`);
  }

  if (args[1]) {
    if (args[1].toLowerCase() === 'vote:up') {
      // Comprueba si el usuario ya había votado positivamente.
      const usersVote = await botManager.getUsersVote(BOT_ID);
      if (usersVote.includes(msg.author.id)) return msg.channel.send(':x: **Ya has votado por este bot**.');

      await botManager.voteUp(BOT_ID, msg.author.id);

      return msg.channel.send('**Has votado positivamente por el bot**.');
    } else if (args[1].toLowerCase() === 'vote:down') {
      const usersVote = await botManager.getUsersVote(BOT_ID);
      if (usersVote.includes(msg.author.id)) return msg.channel.send(':x: **Ya has votado por este bot**.');

      await botManager.voteDown(BOT_ID, msg.author.id);

      return msg.channel.send('**Has votado negativamente por el bot**.');
    } else if (args[1].toLowerCase() === 'vote:del') {
      const usersVote = await botManager.getUsersVote(BOT_ID);
      // Comprueba si el usuario ha votado anteriormente.
      if (!usersVote.includes(msg.author.id)) return msg.channel.send(':x: **No has votado por este bot**. Por lo que no se puede eliminar tu voto.');

      await botManager.deleteVote(BOT_ID, msg.author.id);
      // Envía un mensaje confirmación.
      return msg.channel.send('**Has eliminado tu voto del bot**.');
    } else if (args[1].toLowerCase().startsWith('prefix:')) {
      // Comprueba si es el dueño del bot para poder establecer cambios.
      if (msg.member !== userOwner) return msg.channel.send(':x: **No puedes modificar información de este bot**.');

      await botManager.setPrefix(BOT_ID, args[1].slice(7));
      const newPrefix = await botManager.getPrefix(BOT_ID);
      // Se envía mensaje de confirmación.
      return msg.channel.send(`**Has redefinido el prefijo del bot a** \`${newPrefix}\`.`);
    } else if (args[1].toLowerCase().startsWith('desc:')) {
      // Comprueba si es el dueño del bot para poder establecer cambios.
      if (msg.member !== userOwner) return msg.channel.send(':x: **No puedes modificar información de este bot**.');

      // Comprueba si la descripción se pasa del límite de caracteres (200).
      if (args.slice(1).join(' ').slice(5).length > 200) return msg.channel.send(':x: **La descripción no puede sobrepasar el límite de 200 caracteres**.');

      const description = args.slice(1).join(' ').slice(5);
      botManager.setDescription(BOT_ID, description);

      // Se envía mensaje de confirmación.
      return msg.channel.send(`**Has redefinido la descripción del bot a** \`${dbBot.info}\`.`);
    }
  }

  const isCertified = await botManager.isCertified(BOT_ID);
  const description = await botManager.getDescription(BOT_ID);
  const prefix = await botManager.getPrefix(BOT_ID);
  const owner = await botManager.getOwner(BOT_ID);
  const votesUp = await botManager.getVotesUp(BOT_ID);
  const votesDown = await botManager.getVotesDown(BOT_ID);
  // Creamos el Embed con toda la información que da el bot de la base de datos y lo enviamos posteriormente.
  const embed = new RichEmbed()
      .setAuthor(`${userBot.user.tag}${msg.author.id === userOwner.id ? ' (propiedad tuya)' : ''}`)
      .setDescription(`${isCertified ? '<:sb_verificado:632377244232318986> ' : ''}${description}`)
      .addField('ℹ Prefix', `\`${prefix}\``)
      .addField('💻 Desarrollador', userOwner ? userOwner.user.tag : `${owner} (fuera del servidor)`)
      .addField('📥 Votos', `**Positivos**: ${votesUp}.\n**Negativos**: ${votesDown}`)
      .setColor(0x000000)
      .setThumbnail(userBot.displayAvatarURL);

  msg.channel.send(embed);
};

exports.aliases = ['bot'];
exports.public = true;
exports.description = 'Muestra la información de un bot.';
exports.usage = 's!infobot Mención-ID (vote:up/down/del, prefix:!, desc:Un bot)';
