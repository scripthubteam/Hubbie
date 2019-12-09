const { RichEmbed } = require('discord.js');
const suggestionsChannelId = process.env.suggestionsChannelId;
exports.run = async (client, msg, args) => {
    let color = {
        naranja: 0xFF0044,
        verde: 0x43b581,
        rojo: 0xf04947
    }
    let embed = new RichEmbed() // Se crea un nuevo embed que utilizaremos todo el tiempo.
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL) // Ponemos el avatar y el tag del autor.
        .setTimestamp(); // Y un timestamp solamente para adornar.
    try {
        if (!args[0]) { // Si no hay argumentos retorna esto
            embed
                .setColor(color.rojo)
                .setTitle("¡Faltan argumentos!")
                .setDescription("Necesitas escribir una sugerencia\nUso: `s!sugerir <sugerencia>`");
            msg.channel.send({ embed });
            return;
        } else { // Pero si los hay retornará esto otro.
            embed
                .setColor(color.verde)
                .setTitle("¡Muchas gracias por tu sugerencia!");
            message.channel.send({ embed });
            let suggestion = args.join(' ');
            let suggestEmbed = new RichEmbed()
                .setAuthor(msg.author.tag, msg.author.displayAvatarURL)
                .setColor(color.naranja)
                .setDescription(suggestion)
                .setFooter("Usa `s!sugerir <sugerencia>` para mandar una sugerencia")
                .setTimestamp();
            let channel = msg.guild.channels.get(suggestionsChannelId); // Obtenemos el canal mediante la ID declarada más arriba.
            channel.send({ embed: suggestEmbed }); // Y mandamos el embed con la sugerencia.
        }
    } catch (e) {
        console.log(e.toString())
    }
};

exports.aliases = ['suggest'];
exports.public = true;
exports.description = 'Manda una sugerencia para la organización.';
exports.usage = 's!sugerir <sugerencia>';