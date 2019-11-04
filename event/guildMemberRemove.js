const Discord = require('discord.js')
const db = require("../db/db.js");
db.loadRegHelper();
var Reg,
    BotStorage_;
Reg.init("BotStorage_", "{}");

if (typeof BotStorage_ == 'undefined') {
    BotStorage_ = {};
    try {
        BotStorage_ = JSON.parse(Reg.get("BotStorage_"));
    } catch (e) {
        BotStorage_ = {};
    }
}

module.exports = async (bot, member) => {

    let channelBot = bot.channels.get("640550351874818050") //#playground
    let channelLogHub = bot.channels.get("640550351874818050") //#loghub
    var dbBot = await BotStorage_[member.user.id];

    if(member.user.bot){
      if(dbBot){
        let getOwner = bot.users.get(dbBot.owner.id)

        getOwner.send({"embed": {
            "color": 302176,
            "timestamp": new Date,
            "footer": {
                "text": "Equipo de Aprobación de Aplicaciones"
            },
            "image": {
                "url": "https://i.imgur.com/D56tkxB.png"
            },
            "fields": [
                {
                "name": ":x: Su Bot fue expulsado de Script Hub.",
                "value": "¿Esto es un error? Contacte a un Administrador."
                }
            ]
            }
        })
        delete BotStorage_[member.user.id]
        Reg.save("BotStorage_", JSON.stringify(BotStorage_))
        channelBot.send(":robot: El bot **"+member.user.username+"#"+member.user.discriminator+"** no pertenece más al **Club de Bots**.")
        channelLogHub.send(":robot: [CLUB DE BOTS] **"+member.user.username+"** salió del servidor por no formar parte del **Club de Bots.**")
        return;
      }
      //

      channelLogHub.send(":robot: [COMÚN] **"+member.user.username+"** salió del servidor.")
      return;
    }

    channelLogHub.send("[USER] **"+member.user.username+"** salió del servidor.")
    return;    

};