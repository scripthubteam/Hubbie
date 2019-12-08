require('dotenv').config();
const ruleChannel = process.env.ruleChannel;
const Discord = require('discord.js');

exports.run = async (client, msg, args) => {
  const intRule = 0;
  args = args.join(' ').split('|').map((arg) => arg.trim());
  if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(':x: No posees los permisos necesarios.');

  if (!args[0]) {
    msg.channel.send(':x: Debes especificar una título para la regla a añadir.');
    return;
  }

  if (!args[1]) {
    msg.channel.send(':x: Debes especificar una descripción para la regla a añadir.');
    return;
  }

  const embed = new Discord.RichEmbed()
      .setTitle(args[0])
      .setDescription(args[1])
      .setTimestamp()
      .setColor('RED');
  client.channels.get(ruleChannel).send(embed);
};

exports.aliases = [];
exports.public = false;
exports.description = 'Añade una regla al respectivo canal de reglas.';
exports.usage = 's!addrule ';
