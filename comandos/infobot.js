const Discord = require("discord.js");
const db = require("../db/db.js");

let Reg = db.loadRegHelper(),
    BotStorage_,
    Global;

Reg.init("BotStorage_", "{}");

if (typeof BotStorage_ == 'undefined') {
    BotStorage_ = {};
    try {
        BotStorage_ = JSON.parse(Reg.get("BotStorage_"));
    } catch (e) {
        BotStorage_ = {};
    }
}

Reg.init("Global", "{}");

if (typeof Global == 'undefined') {
    Global = {};
    try {
        Global = JSON.parse(Reg.get("Global"));
    } catch (e) {
        Global = {};
    }
}

exports.run = async (bot, msg, args) => {

        const mentbot = msg.mentions.members.first()
        const cmd_data = args.join(" ")

        let parts = cmd_data.split("|"),
                    botname = parts[0],
                    action = parts[1],
                    mcontent = parts[2];

          if(!botname){
            msg.channel.send(':x: **Es necesario que insertes el nombre del bot.** Puedes @mencionarlo, poner su nombre o ID.')
            return;
          }

          // Convertidores de usuario - @mención, username e ID.
          let botnameConverted

          if(typeof botname === "string"){
            botnameConverted = bot.users.find(f => f.username === botname)
          }

          if(isNaN(botname) === false){
            botnameConverted = bot.users.get(botname)
          }

          if(mentbot){
            botnameConverted = mentbot.user
          }

          if(!botnameConverted){
            msg.channel.send(":x: El bot que intentas buscar no existe.")
            return;
          }

          if(botnameConverted.bot !== true){
            msg.channel.send(":x: **Lo siento, pero la ID introducida no pertenece a un bot.** No puedes introducir la ID de un usuario común!")
            return;
          }

          // Chequeador de base de datos
          const dbBot = BotStorage_[botnameConverted.id]
          if (dbBot) {
            let getTheOwner = dbBot.owner.id
            if(bot.users.get(getTheOwner)){
              getTheOwner = bot.users.get(getTheOwner).tag
            }
            if(isNaN(getTheOwner) === false){
              getTheOwner = dbBot.owner.id+" (Abandonó el servidor)"
              bot.channels.get("440978840114823183").send(" Se ha detectado que el usuario <@"+dbBot.owner.id+"> abandonó el servidor y su bot **"+bot.users.get(dbBot.data.id).tag+"** está en el servidor. **ESTO AMERITA UN KICK A LA APLICACIÓN**")
            }
            let imTheOwnerLol = ''
            let isCertified = ''
            if(dbBot.owner.id === msg.author.id){
              imTheOwnerLol = "(Propiedad tuya)"
            }

            
            if(dbBot.config.certified === true){
              isCertified = "<:sb_verificado:632377244232318986>"
            }
            

            //RichEmbed
            const embed = {"embed": {
            "description": dbBot.config.info,
            "color": msg.member.roles.first().color,
            "footer": {
              "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Star_icon_stylized.svg/2000px-Star_icon_stylized.svg.png"
            },
            "thumbnail": {
              "url": botnameConverted.displayAvatarURL
            },
            "author": {
              "name": botnameConverted.tag+isCertified+" "+imTheOwnerLol,
              "icon_url": botnameConverted.displayAvatarURL
            },
            "fields": [
              {
                "name": "ℹ Prefix",
                "value": "`"+dbBot.config.prefix+"`"
              },

              {
                "name": "💻 Desarrollador",
                "value": getTheOwner,
                "inline": true
              },
              {
                name: ":inbox_tray: Votos",
                value: `Positivos **${dbBot.config.votes_plus}**\nNegativos **${dbBot.config.votes_negative}**`
              }
            ]
          }
        }

            /*Sección de acciones*/

            //Descripción
            if(action == "desc"){
            	if(dbBot.owner.id === msg.author.id || msg.member.roles.has(config.adminsRole) === true || msg.member.roles.has(config.modsRole) === true){
            		if(!mcontent){
            			msg.channel.send(":x: Debes agregar un mensaje.")
            			return;
            		}
            		if(mcontent.length > 30){
            			mcontent = mcontent.substring(0, 30)
            		}
                    BotStorage_[botnameConverted.id].config.info = mcontent
                    Reg.save("BotStorage_", JSON.stringify(BotStorage_));
            		msg.channel.send(":white_check_mark: **Descripción actualizada.**")
            		msg.channel.send("```"+mcontent+"```")
            		if(msg.member.roles.has(config.adminsRole) === true || msg.member.roles.has(config.modsRole) === true && msg.author.id !== dbBot.owner.id){
            			bot.users.get(dbBot.owner.id).send(":information_source: La descripción de su bot **"+bot.users.get(dbBot.data.id).tag+"** fue cambiada por un miembro del equipo de **Script Hub** a `"+mcontent+"`.")
            		}
            		return;
            	}
            	msg.channel.send(":x: Para cambiar la descripción de este bot **es necesario que tú seas el dueño.**")
            	return;
            }

        //Prefijo
            if(action === "prefix"){
            	if(dbBot.owner.id === msg.author.id || msg.member.roles.has(config.adminsRole) === true || msg.member.roles.has(config.modsRole) === true){
            		if(!mcontent){
            			msg.channel.send(":x: Debes agregar el prefijo que quieres añadir.")
            			return;
            		}
            		if(mcontent === dbBot.config.prefix){
            			msg.channel.send(":x: ¿De nuevo el mismo prefijo?")
            			return;
            		}
            		if(mcontent.length > 5){
            			msg.channel.send(":x: Prefijo demasiado largo.")
            			return;
            		}
            		msg.channel.send(":white_check_mark: **Prefijo actualizado.**")
                msg.channel.send("```"+dbBot.config.prefix+" --> "+mcontent+" (nuevo)```")
                BotStorage_[botnameConverted.id].config.prefix = mcontent
                Reg.save("BotStorage_", JSON.stringify(BotStorage_));
            		if(msg.member.roles.has(config.adminsRole) === true || msg.member.roles.has(config.modsRole) === true && msg.author.id !== dbBot.owner.id){
            			bot.users.get(dbBot.owner.id).send(":information_source: El prefijo de su bot **"+bot.users.get(dbBot.data.id).tag+"** fue cambiada por un miembro del equipo de **Script Hub** a `"+mcontent+"`.")
            		}
            		return;
            	}
            	msg.channel.send(":x: Para cambiar el prefijo de este bot **es necesario que tú seas el dueño.**")
            	return;
            }

            //Rating
            if(action === "vote"){
              if(dbBot.config.votes_plus == undefined){
                BotStorage_[botnameConverted.id].config.votes_plus = 0
                BotStorage_[botnameConverted.id].config.votes_negative = 0
                BotStorage_[botnameConverted.id].config.votes_players = []
                Reg.save("BotStorage_", JSON.stringify(BotStorage_));
                msg.channel.send("Hemos actualizado algunas configuraciones de este bot, si usaste un comando por favor intentalo de nuevo.")
                return;
              }
                if (dbBot.config.votes_players.includes(msg.author.id)){
                    msg.channel.send(":x: Lo siento, pero solo se puede votar una vez.")
                  return;
                }
              
              console.log("asdito")
              if (dbBot.owner.id === msg.author.id) return msg.channel.send(":x: No puedes votar por tu propio bot.")
              if(!mcontent){
                  msg.channel.send(":x: Debes votar de la siguiente manera: \n ```\n Para votar positivamente:\n --- s/infobot "+botnameConverted.username+";vote;up \n Para votar negativamente:\n --- s/infobot "+botnameConverted.username+";vote;down ```.")
                  return;
              }
                
              if(mcontent === "up"){
                console.log("up")
                BotStorage_[botnameConverted.id].config.votes_plus += 1;

                if (dbBot.config.votes_players === undefined){
                    var ts = BotStorage_[botnameConverted.id].config.votes_players;
                    ts.push(msg.author.id)
                    console.log(BotStorage_[botnameConverted.id].config.votes_players)
                    Reg.save("BotStorage_", JSON.stringify(BotStorage_));
                } else {
                  console.log("upelse")
                    var ts = BotStorage_[botnameConverted.id].config.votes_players;
                    console.log(BotStorage_[botnameConverted.id].config.votes_players)
                    ts.push(msg.author.id)
                    Reg.save("BotStorage_", JSON.stringify(BotStorage_));
                }
                msg.channel.send(":thumbsup: Genial, has votado **positivamente** para este bot.")
                return;
              }
              if(mcontent === "down"){
                console.log("d")
                BotStorage_[botnameConverted.id].config.votes_negative += 1
                var ts = BotStorage_[botnameConverted.id].config.votes_players;
                ts.push(msg.author.id)
                console.log(BotStorage_[botnameConverted.id].config.votes_players)
                Reg.save("BotStorage_", JSON.stringify(BotStorage_));
                msg.channel.send(":thumbsdown: Vaya, has votado **negativamente** para este bot.")
                return;
              }
              return;
            }
            msg.channel.send(embed)
            return;
          }
          return msg.channel.send(":x: El bot **"+botnameConverted.username+"** no está registrado en el **Club de Bots**!")

}