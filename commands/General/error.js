const Command = require('../../base/Command.js');
const { RichEmbed } = require("discord.js")

module.exports = class ReportError extends Command {
    constructor(client) {
        super(client, {
            name: 'error',
            description: 'En caso de encontrar un error, usa este comando.',
            usage: prefix => `\`${prefix}error\``,
            examples: prefix => `\`${prefix}error\``,
            enabled: true,
            ownerOnly: false,
            guildOnly: false,
            aliases: ['bug'],
            memberPermissions: [],
            dirname: __dirname
        });
    }
    async run(message, args, data) {
        try {
            const embed = new RichEmbed()
                .setColor(0x00ebb0)
                .setTitle('Oh, ¿encontraste uno de esos?. Deja que nos encarguemos de eso.')
                .setDescription(
                    'Por favor, envíanos detalladamente cómo se produjo el error [aquí](https://github.com/scripthubteam/Script-Hub-Free/issues).'
                )
                .setThumbnail('https://i.imgur.com/B1YsRel.jpg');
            message.channel.send({ embed: embed });
        } catch (e) {
            console.error(e);
        }
    }
};
