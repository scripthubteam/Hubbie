module.exports = (client) => {
  // Señal de vida.
  console.log(client.user.tag+" ("+process.env.PREFIX+") - Listo!");
  client.user.setActivity("Documentación y bots", {type: 'WATCHING'}).catch();
}