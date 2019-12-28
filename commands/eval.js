require('dotenv').config();
const { RichEmbed } = require('discord.js');

exports.run = async (client, msg, args) => {
	let arr = [
		'595734746059898927',
		'280985817097306113',
		'506199865722798092',
		'608817245417898004'
	];
	if (!arr.includes(msg.author.id)) return;
	else {
		let author = message.author,
			member = message.member,
			guild = message.guild,
			channel = message.channel,
			client = message.client,
			message = msg;
		try {
			let evalued = await eval(args.join(' '));
			if (typeof evalued !== 'string')
				evalued = util.inspect(evalued, { depth: 0 });
			if (evalued.length > 1950) {
				message.channel.send('> Error: El resultado es muy largo');
			} else if (evalued.includes(client.token || process.env.MONGOURI)) {
				message.channel.send('> Error: El resultado contiene un token');
			} else {
				message.channel.send('> Hecho:\n```js\n' + evalued + '\n```');
			}
		} catch (err) {
			err = util.inspect(err, { depth: 0 });
			if (err.includes(client.token || process.env.MONGOURI))
				err = err.replace(client.token || process.env.MONGOURI, 'T0K3N');
			message.channel.send('> Error: \n```js\n' + err + '\n```');
		}
	}
};

exports.aliases = ['e', 'chk'];
exports.public = false;
exports.description = 'Evalúa código.';
exports.usage = 's!eval código';
