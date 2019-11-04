const Discord = require("discord.js")
const pms = require("pretty-ms")
const ms = require("ms")
var Reg,
    Col;

exports.run = async (bot, msg, args) => {
    let src = msg.author
    let argsData = args.join(" ");
    let parts = argsData.split("|"),
        name = parts[0],
        langs = parts[1],
        libs = parts[2],
        desc = parts[3],
        prog = parts[4],
        repo = parts[5];

    let chan = bot.channels.get("635610617428049950");
    if (!Col[src.id]) Col[src.id] = {
        cd: 0
    };

    Reg.save("Col", JSON.stringify(Col));

    var cooldown = Col[src.id].cd
    var day = Date.now() / 1000
    var actual = day - cooldown
    if (cooldown === 0) actual =  86400
    if (actual < 86400) return msg.channel.send(":x: No puedes ejecutar esta acción tan repetidamente. Vuelve en **" + pms(ms((86400 - actual).toFixed() + "s")) + "**.")  
    
    if (!name) {
        msg.channel.send(":x: **Especifica un nombre para el proyecto.**");
        return;
    }

    if (name.length > 15) {
        msg.channel.send(":x: **El nombre no debe superar los 15 caractéres.**");
        return;
    }

    if (!langs) {
        msg.channel.send(":x: **Especifica uno o más lenguajes para el proyecto.**");
        return;
    }

    if (!libs) {
        msg.channel.send(":x: **Especifica las librerías utilizadas en el proyecto.**");
        return;
    }

    if (!desc) {
        msg.channel.send(":x: **Especifica una descripción para el proyecto.**");
        return;
    }

    if (desc.length > 40) {
        msg.channel.send(":x: **La descripción no debe superar los 40 caractéres.**");
        return;
    }
  
    if (!prog) {
        msg.channel.send(":x: **Especifique el progreso del proyecto**");
        return;
    }
  
    if(isNaN(prog) === true) {
        msg.channel.send(":x: **El progreso debe ser especificado en formato numérico.**");
        return;
    }
  
    if (prog > 100 || prog < 1) {
        msg.channel.send(":x: **Debe utilizar un número entre `1 - 100`. Para postular un proyecto debe tener un 1% de progreso.**");
        return;
    }
  
    if (!repo) {
        msg.channel.send(":x: **Especifica un repositorio de GitHub para el proyecto.**");
        return;
    }

    Col[src.id].cd = day;
    var ea = new Discord.RichEmbed()
        .setDescription("**Descripción:** "+desc+"\n**Lenguaje(s):** "+langs+"\n**Librería(s):** "+libs+"\n**Progreso:** "+prog+"%\n**Repositorio:** "+repo)
        .setColor(0x36393e)
        .setAuthor(name, bot.user.avatarURL)
        .setThumbnail(msg.author.displayAvatarURL)
        .setFooter("Autor: "+msg.author.username)
    chan.send(ea);

};