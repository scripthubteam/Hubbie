require('dotenv').config();
const privateLogsChannelId = process.env.privateLogsChannelId;
const { RichEmbed } = require('discord.js');

module.exports = async (client, msg) => {
	// Se crea un Embed base con el autor del mensaje.
	const embed = new RichEmbed()
		.setColor(0xf04947)
		.setTitle('<:shMiscTickError:653815214541766656> • Mensaje borrado en ' + msg.channel.name)
		.addField('> Usuario:', `<@${msg.author.id}> \`(${msg.author.id})\``);

	// Si hay mensaje lo coloca en el Embed.
	if (msg.content) {
		embed.addField('> Mensaje:', msg.content);
	}

	// Si hay archivos adjuntos en el mensaje se colocan.
	if (msg.attachments.size > 0) {
		// Se colocan de la siguiente forma [archivo.adjunto](url), [archivo](url).
		const urls = msg.attachments
			.map(r => `[${r.filename}](https://media.discordapp.net/attachments/${msg.channel.id}/${r.id}/${r.filename})`)
			.join(',\n');

		// Se agregan al Embed.
		embed.addField('> Archivos:', `${urls}`);
	}

	// Se envía el Embed al registro privado.
	client.channels
		.get(privateLogsChannelId)
		.send(embed)
		.catch(e => {
			console.error(e);
		});
};
