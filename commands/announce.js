require('dotenv').config();
const {RichEmbed} = require('discord.js');
const announceChannelId = process.env.announceChannelId;

exports.run = async (client, msg, args) => {
  let depName;

  if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(':x: No posees los permisos necesarios.');

  args = args.join(' ').split('|').map((arg) => arg.trim());

  if (!args[0]) {
    msg.channel.send(':x: Debes especificar una título para el anuncio.');
    return;
  }

  if (!args[1]) {
    msg.channel.send(':x: Debes especificar el cuerpo para el anuncio.');
    return;
  }

  if (!args[2]) {
    msg.channel.send(':x: Debes catalogar tu anuncio como `(t) trivial - (r) relevante - (i) importante`');
    return;
  }

  if (args[2] != 't' && args[2] != 'trivial' && args[2] != 'r' && args[2] != 'relevante' && args[2] != 'i' && args[2] != 'importante') {
    msg.channel.send(':x: Debes especificar entre `(t) trivial - (r) relevante - (i) importante`.');
    return;
  }

  let embedColor;
  if (args[2] === 't') args[2] = '', embedColor = 'GREEN';
  if (args[2] === 'r') args[2] = '@here', embedColor = 'BLUE';
  if (args[2] === 'i') args[2] = '@everyone', embedColor = 'RED';

  if (!args[3]) {
    msg.channel.send(':x: Debes especificar el tipo de mensaje en donde `(e) embed - (s) simple - (ec) embed complejo`.');
    return;
  }

  if (args[3] != 'e' && args[3] != 's' && args[3] != 'ec') {
    msg.channel.send(':x: Debes especificar entre `(e) embed - (s) simple - (ec) embed complejo`.');
    return;
  }


  // Departamento comunidad
  if (msg.channel.id === '643948768118571028') depName = 'departamento comunitario';
  // Departamento técnico
  if (msg.channel.id === '643948656545890320') depName = 'departamento técnico';
  // Departamento general
  if (msg.channel.id === '609010510599421985') depName = 'departamento general';
  let toSend;

  if (args[3] === 'e') {
    toSend = new RichEmbed()
        .setTitle(args[0])
        .setDescription(args[1])
        .setFooter('Comunicado del ' + depName + '.')
        .setColor(embedColor);
  } else if (args[3] === 'ec') {
    toSend = new RichEmbed()
        .setTitle(args[0])
        .setDescription(args[1])
        .setFooter('Comunicado del ' + depName + '.')
        .setColor(embedColor);
  } else if (args[3] === 's') {
    toSend = '```' + args[0] + '```\n' +
            '' + args[1] + '\n\n' +
            '**Comunicado del ' + depName + '.**\n\n';
  }

  client.channels.get(announceChannelId).send(args[2], toSend);
};

exports.aliases = [];
exports.public = false;
exports.description = 'Envía un anuncio al respectivo canal de anuncios.';
exports.usage = 's!announce título|cuerpo|(t) trivial - (r) relevante (here) - (i) importante (everyone)|(e) embed - (s) simple - (ec) embed complejo';
