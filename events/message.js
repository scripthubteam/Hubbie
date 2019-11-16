require('dotenv').config()
module.exports = (client, message) => {
  // Condiciones útiles para saber si es un bot, si está en mensaje directo y si no es un comando.
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.toLowerCase().startsWith(process.env.PREFIX)) return;
  // Definición de cosas útiles como argumentos y el propio comando.
  let args = message.content.slice(2).split(/ +/g);
  let cmd = args.shift().toLowerCase();
  let err = false;
  // Administrador de comandos (3/3).
  try {
    // Se obtiene el comando por medio de alias o su propio nombre.
    let cmdData = client.cmds.get(cmd) || client.cmds.find(cmd => cmd.aliases.includes(cmd));
    // Se ejecuta la función run del archivo del comando obtenido.
    cmdData.file.run(client, message, args);
  } catch (e) {
    // Si hay algún error coloca una variable a true y muestra el error en consola.
    err = true;
    console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
  } finally {
    // Muestra en la consola el comando ejecutado y si hay error lo muestra en rojo.
    console[err ? "error" : "log"](`${message.author.tag} ejecutó el comando ${cmd}`);
  }
}