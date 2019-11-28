const { ruleChannel } = require("../channelsConfig.json.js");
const Discord = require("discord.js");

exports.run = async (client, msg, args) => {

    args = args.join(" ").split("|").map(arg => arg.trim());
    if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(":x: No posees los permisos necesarios.");

    if (!args[0]) {
        msg.channel.send(":x: Debes especificar una título para la regla a añadir.");
        return;
    }

    if (!args[1]) {
        args[1] = "No se especifico una descripción para esta regla."
    }

    let embed = new Discord.RichEmbed()
    .setTitle(args[0])
    .setDescription(args[1])
    .setFooter("Regla #"+aquíirialadb)
    client.channels.get(ruleChannel).send(embed)

}