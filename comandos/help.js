const Discord = require("discord.js");

exports.run = async (bot, msg, args) => {

    var e = new Discord.RichEmbed()
        .setColor(0x36393e)
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .addField("¡Lista de comandos!", "**[s!infobot (prefix, vote, desc)(prefix: nuevo prefijo, vote: up/down, desc: texto)](https://scripthubteam.github.io/)** - Interactúa con el club de bots. Debe pertenecer a nuestro club de bots. (Debes utilizar una `|` entre cada argumento.)\n" +
        "**[s!invite ID prefijo](https://scripthubteam.github.io/)** - Invita a tu bot. Debe ser utilizado en el canal de invitaciones.\n" +
        "**[s!queue ID](https://scripthubteam.github.io/)** - Muestra el número en la cola de espera\n" +
        "**[s!project nombre|lenguaje(s)|librería(s)|descripción|progreso(número, ej: 50|)|algún link del proyecto](https://scripthubteam.github.io/)** - Registra un proyecto y compártelo con la comunidad.\n")
    msg.channel.send(e)
    return;
}