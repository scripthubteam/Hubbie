require('dotenv').config();
const globalChannelId = process.env.globalChannelId;
const privateLogsChannelId = process.env.privateLogsChannelId;
const { RichEmbed } = require('discord.js');

const BotManager = require('../lib/BotManager');
const botManager = new BotManager();
// Bot Modules

module.exports = async(client, member) => {
    // Si el usuario es un bot, lo coloca para ser aprobado.
    if (member.user.bot) {
        // Comprueba si el bot existe o está en el club de bots.
        const botExists = await botManager.botExists(member.user.id);
        if (!botExists) return client.channels.get(privateLogsChannelId).send(`:robot: **[COMÚN] ${member.user.username}** salió del servidor.`);

        // Añade roles correspondientes para ser el bot probado y aprobado.
        member.addRole(member.guild.roles.find((r) => r.name === 'ToTest'));

        // Envía un mensaje de la entrada del bot al canal privado del personal del servidor.
        client.channels.get(privateLogsChannelId).send(`**[BOT] ${member.user.tag}** ha sido invitado al servidor y requiere de aprobación.`).catch((e) => {
            console.log(e);
        });
    } else {
        // Se crea un Embed para la bienvenida de cualquier usuario normal.
        const embed = new RichEmbed()
            .setTitle(`¡Bienvenido/a ${member.user.tag}!`)
            .setDescription('Gracias por unirte a **Script Hub**.\n**—** Lee <#640985543630389288> para empezar tu recorrido por el servidor.\n**—** Lee <#606688095328272394> para seguir el fundamento del servidor.\n**—** ¿Necesitas ayuda? Consulta tus dudas en <#614201710855979102>.')
            .setColor(0x03e45c)
            .setTimestamp(new Date())
            .setFooter(`${member.guild.name} - N#${member.guild.memberCount}`)
            .setImage('https://i.imgur.com/D56tkxB.png');

        // Se envía el Embed al canal general/global.
        client.channels.get(globalChannelId).send(member.user.toString(), embed).catch((e) => {
            console.log(e);
        });

        // Se agregan roles correspondientes al usuario.
        member.addRole(member.guild.roles.find((r) => r.name === 'Usuario'));

        // Por útlimo muestra en el canal del personal que el usuario entró.
        client.channels.get(privateLogsChannelId).send(`**[USER] ${member.user.tag}** entró al servidor.`).catch((e) => {
            console.log(e);
        });
    };
};