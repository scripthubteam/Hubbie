const botSchema = require("../models/botSchema")

exports.run = async (bot, msg, args) => {
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    
    const mentbot = msg.mentions.members.first();

    if(!mentbot) {
        msg.channel.send(":x: Necesitas mencionar un bot.");
        return;
    }

    let dbBot = await botSchema.findOne({
        botId: mentbot.id
    })

    if(dbBot.certified === true) {
        msg.channel.send(":x: El bot ingresado ya está certificado.");
        return;
    }
    
    await botSchema.findOneAndUpdate({
        botId: mentbot.id
    },
    {
        certified: true
    })

    msg.channel.send("**El bot fue certificado.**");
    return;

}