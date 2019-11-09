const chan = require("../chans.json")
const botSchema = require("../models/botSchema")
const globalSchema = require("../models/queueSchema")

exports.run = async (bot, msg, args) => {
  const mentbot = msg.mentions.members.first()

  const cmd_data = args.join(" ")

  let parts = cmd_data.split("|"),
    botname = parts[0],
    action = parts[1],
    mcontent = parts[2];

  if (!botname) {
    msg.channel.send(':x: **Es necesario que insertes el nombre del bot.** Puedes @mencionarlo, poner su nombre o ID.')
    return;
  }

  // Convertidores de usuario - @mención, username e ID.
  let botnameConverted

  if (typeof botname === "string") {
    botnameConverted = bot.users.find(f => f.username === botname)
  }

  if (isNaN(botname) === false) {
    botnameConverted = bot.users.get(botname)
  }

  if (mentbot) {
    botnameConverted = mentbot.user
  }

  if (!botnameConverted) {
    msg.channel.send(":x: El bot que intentas buscar no existe.")
    return;
  }

  if (botnameConverted.bot !== true) {
    msg.channel.send(":x: **Lo siento, pero la ID introducida no pertenece a un bot.** No puedes introducir la ID de un usuario común!")
    return;
  }

  // Chequeador de base de datos
  const dbBot = await botSchema.findOne({
    botId: botnameConverted.id
  })
  if (dbBot) {
    let getTheOwner = dbBot.ownerId
    if (bot.users.get(getTheOwner)) {
      getTheOwner = bot.users.get(getTheOwner).tag
    }
    if (isNaN(getTheOwner) === false) {
      getTheOwner = dbBot.ownerId + " (Abandonó el servidor)"
      bot.channels.get(chan.staffTestChan).send(" Se ha detectado que el usuario <@" + dbBot.ownerId + "> abandonó el servidor y su bot **" + bot.users.get(dbBot.data.id).tag + "** está en el servidor. **ESTO AMERITA UN KICK A LA APLICACIÓN**")
    }
    let imTheOwnerLol = ''
    let isCertified = ''
    if (dbBot.ownerId === msg.author.id) {
      imTheOwnerLol = "(Propiedad tuya)"
    }


    if (dbBot.certified === true) {
      isCertified = "<:sb_verificado:632377244232318986>"
    }


    //RichEmbed
    const embed = {
      "embed": {
        "description": dbBot.info,
        "color": msg.member.roles.first().color,
        "footer": {
          "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/2000px-Star_icon_stylized.svg.png"
        },
        "thumbnail": {
          "url": botnameConverted.displayAvatarURL
        },
        "author": {
          "name": botnameConverted.tag + isCertified + " " + imTheOwnerLol,
          "icon_url": botnameConverted.displayAvatarURL
        },
        "fields": [{
            "name": "ℹ Prefix",
            "value": "`" + dbBot.prefix + "`"
          },

          {
            "name": "💻 Desarrollador",
            "value": getTheOwner,
            "inline": true
          },
          {
            name: ":inbox_tray: Votos",
            value: `Positivos **${dbBot.votes_plus}**\nNegativos **${dbBot.votes_negative}**`
          }
        ]
      }
    }

    /*Sección de acciones*/

    //Descripción
    if (action == "desc") {
      if (dbBot.ownerId === msg.author.id || msg.member.roles.has("606256306558599178") === true || msg.member.roles.has("440552554296901632") === true) {
        if (!mcontent) {
          msg.channel.send(":x: Debes agregar un mensaje.")
          return;
        }
        if (mcontent.length > 30) {
          mcontent = mcontent.substring(0, 30)
        }
        BotStorage_[botnameConverted.id].config.info = mcontent
        Reg.save("BotStorage_", JSON.stringify(BotStorage_));
        msg.channel.send(":white_check_mark: **Descripción actualizada.**")
        msg.channel.send("```" + mcontent + "```")
        if (msg.member.roles.has("606256306558599178") === true || msg.member.roles.has("440552554296901632") === true && msg.author.id !== dbBot.ownerId) {
          bot.users.get(dbBot.ownerId).send(":information_source: La descripción de su bot **" + bot.users.get(dbBot.data.id).tag + "** fue cambiada por un miembro del equipo de **Script Hub** a `" + mcontent + "`.")
        }
        return;
      }
      msg.channel.send(":x: Para cambiar la descripción de este bot **es necesario que tú seas el dueño.**")
      return;
    }

    //Prefijo
    if (action === "prefix") {
      if (dbBot.ownerId === msg.author.id || msg.member.roles.has("606256306558599178") === true || msg.member.roles.has("440552554296901632") === true) {
        if (!mcontent) {
          msg.channel.send(":x: Debes agregar el prefijo que quieres añadir.")
          return;
        }
        if (mcontent === dbBot.prefix) {
          msg.channel.send(":x: ¿De nuevo el mismo prefijo?")
          return;
        }
        if (mcontent.length > 5) {
          msg.channel.send(":x: Prefijo demasiado largo.")
          return;
        }
        msg.channel.send(":white_check_mark: **Prefijo actualizado.**")
        msg.channel.send("```" + dbBot.prefix + " --> " + mcontent + " (nuevo)```")
        dbBot.prefix = mcontent
        await botSchema.findOneAndUpdate({
          botId: dbBot.botId
        }, {
          prefix: dbBot.prefix
        })
        if (msg.member.roles.has("606256306558599178") === true || msg.member.roles.has("440552554296901632") === true && msg.author.id !== dbBot.ownerId) {
          bot.users.get(dbBot.ownerId).send(":information_source: El prefijo de su bot **" + bot.users.get(dbBot.botId).tag + "** fue cambiada por un miembro del equipo de **Script Hub** a `" + mcontent + "`.")
        }
        return;
      }
      msg.channel.send(":x: Para cambiar el prefijo de este bot **es necesario que tú seas el dueño.**")
      return;
    }

    //Rating
    if (action === "vote") {
      if (dbBot.votes_plus === undefined || dbBot.votes_plus === null) {
        dbBot.votes_plus = 0
        dbBot.votes_negative = 0
        dbBot.vote_players = []

        await botSchema.findOneAndUpdate({
          botId: dbBot.botId
        }, {
          votes_plus: dbBot.votes_plus,
          votes_negative: dbBot.votes_negative,
          vote_players: dbBot.vote_players
        })

        msg.channel.send("Hemos actualizado algunas configuraciones de este bot, si usaste un comando por favor intentalo de nuevo.")
        return;
      }
      if (dbBot.vote_players.includes(msg.author.id)) {
        msg.channel.send(":x: Lo siento, pero solo se puede votar una vez.")
        return;
      }

      if (dbBot.ownerId === msg.author.id) return msg.channel.send(":x: No puedes votar por tu propio bot.")
      if (!mcontent) {
        msg.channel.send(":x: Debes votar de la siguiente manera: \n ```\n Para votar positivamente:\n --- s/infobot " + botnameConverted.username + ";vote;up \n Para votar negativamente:\n --- s/infobot " + botnameConverted.username + ";vote;down ```.")
        return;
      }

      if (mcontent === "up") {
        dbBot.votes_plus += 1;

        if (dbBot.vote_players === undefined) {
          var ts = dbBot.vote_players;
          ts.push(msg.author.id)
          await botSchema.findOneAndUpdate({
            botId: dbBot.botId
          }, {
            votes_plus: dbBot.votes_plus,
            votes_negative: dbBot.votes_negative,
            vote_players: dbBot.vote_players
          })

        } else {
          var ts = dbBot.vote_players;
          ts.push(msg.author.id)
          await botSchema.findOneAndUpdate({
            botId: dbBot.botId
          }, {
            votes_plus: dbBot.votes_plus,
            votes_negative: dbBot.votes_negative,
            vote_players: dbBot.vote_players
          })

        }
        msg.channel.send(":thumbsup: Genial, has votado **positivamente** para este bot.")
        return;
      }
      if (mcontent === "down") {
        dbBot.votes_negative += 1
        var ts = dbBot.vote_players;
        ts.push(msg.author.id)
        await botSchema.findOneAndUpdate({
          botId: dbBot.botId
        }, {
          votes_plus: dbBot.votes_plus,
          votes_negative: dbBot.votes_negative,
          vote_players: dbBot.vote_players
        })
        msg.channel.send(":thumbsdown: Vaya, has votado **negativamente** para este bot.")
        return;
      }
      return;
    }
    msg.channel.send(embed)
    return;
  }
  return msg.channel.send(":x: El bot **" + botnameConverted.username + "** no está registrado en el **Club de Bots**!")

}