const Command = require('../../base/Command.js'),
    { RichEmbed } = require('discord.js');
module.exports = class Bots extends Command {
    constructor(client) {
        super(client, {
            name: 'denegar',
            description: 'Deniega el acceso de un bot al club de bots.',
            usage: prefix => `\`${prefix}denegar <bot> <razón>\``,
            examples: prefix => `\`${prefix}denegar @Ginko No sirve.\``,
            enabled: true,
            ownerOnly: false,
            guildOnly: true,
            aliases: ['deny'],
            memberPermissions: [],
            dirname: __dirname
        });
    }

    async run(message, args, data) {
        let embed = new RichEmbed(),
            server = this.client.config.servidor;
        try {
            if (
                !message.member.roles.has(server.roles.staff.departamento.comunidad)
            ) {
                return message.channel.send(
                    ':x: | No eres del Departamento Comunidad.'
                );
            } else {
                if (!args[0]) {
                    return message.channel.send(
                        ':x: | Necesitas mencionar a un bot para denegar.'
                    );
                } else {
                    if (!args[1]) {
                        return message.channel.send(
                            ':x: | Necesitas especificar una razón.'
                        );
                    } else {
                        let member =
                            message.mentions.members.first() ||
                            message.guild.members.find(x =>
                                `${x.displayName}${x.user.tag}`
                                    .toLowerCase()
                                    .includes(args[0].toLowerCase())
                            ) ||
                            message.guild.members.get(args[0]);
                        if (!member) {
                            return message.channel.send(
                                ':x: | El bot no está en el servidor.'
                            );
                        } else {
                            if (!member.user.bot) {
                                return message.channel.send(
                                    ':x: | El usuario especificado no es un bot.'
                                );
                            } else {
                                let bot = await this.client.botsys.findOrCreateBot({ id: member.id });
                                if (!bot.invited) {
                                    return message.channel.send(
                                        ':x: | Ese bot no está invitado.'
                                    );
                                } else {
                                    if (bot.accepted) {
                                        return message.channel.send(
                                            ':x: | Ese bot ya ha sido aceptado.'
                                        );
                                    } else {
                                        if (message.member) {
                                            embed
                                                .setColor(this.client.colors.red)
                                                .setThumbnail(member.user.displayAvatarURL)
                                                .setTitle('¡Bot denegado!')
                                                .setDescription(
                                                    'Tu bot ha sido denegado por el equipo de Script Hub.'
                                                )
                                                .addField('Moderador/a', message.author.tag)
                                                .addField('Razón', args.slice(1).join(' '));
                                            this.client.users.get(bot.info.ownerID).send({ embed });
                                        }
                                        if (bot.invite.messageID) {
                                            let msg = await this.client.channels
                                                .get(server.categorias.bots.canales.invitar)
                                                .fetchMessage(bot.invite.messageID);
                                            let acceptEmbed = new RichEmbed()
                                                .setColor(this.client.colors.red)
                                                .setThumbnail(member.user.displayAvatarURL)
                                                .setTitle('¡Petición denegada!')
                                                .addField(
                                                    'Tu bot ha sido denegado en el servidor',
                                                    'Si crees que esto es un error; comunícate con un moderador.'
                                                )
                                                .addField('Bot', `<@${bot.id}>`, true)
                                                .addField(
                                                    'Desarrollador/a',
                                                    `<@${bot.info.ownerID}>`,
                                                    true
                                                );
                                            await msg.edit({ embed: acceptEmbed });
                                        }
                                        await data.guild.save();
                                        await this.client.botsys.deleteBot(member.id);
                                        member.kick('No aceptado en fase de pruebas.');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
};