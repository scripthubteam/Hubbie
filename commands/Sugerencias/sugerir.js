const Command = require('../../base/Command.js');
const { RichEmbed } = require("discord.js")
module.exports = class Sugerencias extends Command {
    constructor(client) {
        super(client, {
            name: 'sugerir',
            description: 'Crea una sugerencia.',
            usage: prefix => `\`${prefix}sugerir [<sugerencia>]\``,
            examples: prefix =>
                `\`${prefix}sugerir Sugiero que X esté disponible.\``,
            enabled: true,
            ownerOnly: false,
            guildOnly: false,
            aliases: ['sugerencia', 'suggest'],
            memberPermissions: [],
            dirname: __dirname
        });
    }

    async run(message, args) {
        let color = {
            naranja: "#FF9D00",
            verde: 0x43b581,
            rojo: 0xf04947
        }
        let embed = new RichEmbed() // Se crea un nuevo embed que utilizaremos todo el tiempo.
            .setAuthor(message.author.tag, message.author.displayAvatarURL) // Ponemos el avatar y el tag del autor.
            .setTimestamp(); // Y un timestamp solamente para adornar.
        try {
            if (!args[0]) { // Si no hay argumentos retorna esto
                embed
                    .setColor(color.rojo)
                    .setTitle("¡Faltan argumentos!")
                    .setDescription("Necesitas escribir una sugerencia\nUso: `s!sugerir <sugerencia>`");
                message.channel.send({ embed });
                return;
            } else { // Pero si los hay retornará esto otro.
                embed
                    .setColor(color.verde)
                    .setTitle("¡Muchas gracias por tu sugerencia!");
                message.channel.send({ embed });
                let suggestion = args.join(' ');
                let suggestEmbed = new RichEmbed()
                    .setTitle("¡Nueva sugerencia!")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setColor(color.naranja)
                    .setDescription(suggestion)
                    .setFooter("Usa `s!sugerir <sugerencia>` para mandar una sugerencia")
                    .setTimestamp();
                let channel = message.guild.channels.get(this.client.config.servidor.categorias.comunidad.canales.sugerencias); // Obtenemos el canal mediante la ID declarada más arriba.
                let suggestReact = await channel.send({ embed: suggestEmbed });
                await suggestReact.react('653815214273331201');
                await suggestReact.react('653815214541766656'); // Y mandamos el embed con la sugerencia.
            }
        } catch (e) {
            console.log(e.toString())
        }
    }
};