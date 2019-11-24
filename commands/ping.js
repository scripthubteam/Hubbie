exports.run = async (client, msg, args) => {
  // Envía la latencia actual en milisegundos.
  msg.channel.send(`Pong! ${Math.floor(client.ping)}ms.`);
};

exports.aliases = [];
exports.public = false;
exports.description = 'Muestra la latencia en milisegundos.';
exports.usage = 's!ping';
