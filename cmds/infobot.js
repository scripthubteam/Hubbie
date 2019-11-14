const privateLogsChannelId = require("../config/index.json").chan.privateLogsChannelId;
const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  // Obtiene y comprueba si el bot mencionado está en el servidor.
  let userBot = msg.guild.members.get(args[0]) || msg.mentions.members.first();

  if (!userBot) return msg.channel.send(":x: **El bot que intentas buscar no está en el servidor**.");

  if (!userBot.user.bot) return msg.channel.send(":x: **El usuario que mencionaste no es un bot**.");

  // Obtiene el bot del club y su dueño.
  let dbBot = await client.db.bots.findOne({ _id: userBot.id }).exec();
  let userOwner = msg.guild.members.get(dbBot.ownerId);

  // Comprueba si está en el club.
  if (!dbBot) return msg.channel.send(":x: **Este bot no está registrado en el club de bots**.");

  // Comprueba si el dueño está dentro del servidor.
  if (!userOwner) client.channels.get(privateLogsChannelId).send(`Se ha detectado que el usuario <@${dbBot.ownerId}> abandonó el servidor y su bot **${userBot.tag}** está en el servidor. **ESTO AMERITA UN KICK A LA APLICACIÓN**.`);

  // Comprueba si se modificará alguna información del bot o se añadirá un voto.
  if (args[1]) {
    if (args[1].toLowerCase() === "vote:up") {
      // Comprueba si el usuario ya había votado positivamente.
      if (dbBot.votes.some((a) => a[0] === msg.author.id && a[1] === 1)) return msg.channel.send(":x: **Ya has votado positivamente por este bot**.");

      // Comprueba si había votado anteriormente y lo edita, de lo contrario:
      // Si el usuario quiere votar positivamente haga lo siguiente.
      // Se añade su ID a un Array y se coloca un 1  de positivo.
      if (dbBot.votes.some((a) => a[0] === msg.author.id)) await dbBot.votes.splice(dbBot.votes.findIndex((a) => a[0] === msg.author.id), 1);
      await dbBot.votes.push([msg.author.id, 1]);

      // Guarda todo y envía un mensaje de confirmación.
      dbBot.save();
      return msg.channel.send("**Has votado positivamente por el bot**.");
    } else if (args[1].toLowerCase() === "vote:down") {
      // Comprueba si el usuario ya había votado negativamente.
      if (dbBot.votes.some((a) => a[0] === msg.author.id && a[1] === 0)) return msg.channel.send(":x: **Ya has votado negativamente por este bot**.");

      // Comprueba si había votado anteriormente y lo edita, de lo contrario:
      // Si el usuario quiere votar negativamente haga lo siguiente.
      // Se añade su ID a un Array y se coloca un 0 de negativo.
      if (dbBot.votes.some((a) => a[0] === msg.author.id)) await dbBot.votes.splice(dbBot.votes.findIndex((a) => a[0] === msg.author.id), 1);
      await dbBot.votes.push([msg.author.id, -1]);
      
      // Guarda todo y envía un mensaje de confirmación.
      dbBot.save();
      return msg.channel.send("**Has votado negativamente por el bot**.");
    } else if (args[1].toLowerCase() === "vote:del") {
      // Comprueba si el usuario ha votado anteriormente.
      if (!dbBot.votes.some((a) => a[0] === msg.author.id)) return msg.channel.send(":x: **No has votado por este bot**. Por lo que no se puede eliminar tu voto.");

      // Busca la posición del voto, lo elimina y lo guarda.
      await dbBot.votes.splice(dbBot.votes.findIndex((a) => a[0] === msg.author.id), 1);
      dbBot.save();

      // Envía un mensaje confirmación.
      return msg.channel.send("**Has eliminado tu voto del bot**.");
    } else if (args[1].toLowerCase().startsWith("prefix:")) {
      // Comprueba si es el dueño del bot para poder establecer cambios.
      if (msg.member !== userOwner) return msg.channel.send(":x: **No puedes modificar información de este bot**.");

      // Se establece el prefijo del bot al que especificó el usuario y se guarda.
      dbBot.prefix = args[1].slice(7);
      dbBot.save();

      // Se envía mensaje de confirmación.
      return msg.channel.send(`**Has redefinido el prefijo del bot a** \`${dbBot.prefix}\`.`);
    } else if (args[1].toLowerCase().startsWith("desc:")) {
      // Comprueba si es el dueño del bot para poder establecer cambios.
      if (msg.member !== userOwner) return msg.channel.send(":x: **No puedes modificar información de este bot**.");

      // Comprueba si la descripción se pasa del límite de caracteres (200).
      if (args.slice(1).join(" ").slice(5).length > 200) return msg.channel.send(":x: **La descripción no puede sobrepasar el límite de 200 caracteres**.");

      // Se establece la descripción del bot a la que especificó el usuario y se guarda.
      dbBot.info = args.slice(1).join(" ").slice(5);
      dbBot.save();

      // Se envía mensaje de confirmación.
      return msg.channel.send(`**Has redefinido la descripción del bot a** \`${dbBot.info}\`.`);
    }
  }

  // Creamos el Embed con toda la información que da el bot de la base de datos y lo enviamos posteriormente.
  let embed = new RichEmbed()
    .setAuthor(`${userBot.user.tag}${msg.author.id === userOwner.id ? " (propiedad tuya)" : ""}`)
    .setDescription(`${dbBot.certified ? "<:sb_verificado:632377244232318986> " : ""}${dbBot.info}`)
    .addField("ℹ Prefix", `\`${dbBot.prefix}\``)
    .addField("💻 Desarrollador", userOwner ? userOwner.user.tag : `${dbBot.ownerId} (fuera del servidor)`)
    .addField("📥 Votos", `**Positivos**: ${dbBot.votes.filter(v => v[1] === 1).length}.\n**Negativos**: ${dbBot.votes.filter(v => v[1] === 0).length}.`)
    .setColor(0x000000)
    .setThumbnail(userBot.displayAvatarURL);

  msg.channel.send(embed);
}

exports.aliases = [];
exports.public = true;
exports.description = "Muestra la información de un bot.";
exports.usage = "s!infobot Mención-ID (vote:up/down/del, prefix:!, desc:Un bot)";
