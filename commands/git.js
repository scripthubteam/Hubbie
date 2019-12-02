exports.run = async (client, msg, args) => {
  // Verifica si el usuario pertenece al personal del servidor.
  if (!msg.member.hasPermission('MANAGE_GUILD')) return msg.channel.send(':x: No posees los permisos necesarios.');

  // Se obtiene la librería child_process para poder ejecutar comandos de consola.
  const {exec} = require('child_process');

  // Se ejecuta el comando para obtener los archivos más recientes del ScriptHubFree.
  exec('git pull origin master', (err, stdout, stderr) => {
    // Si hay algún error haga lo siguiente.
    if (err) {
      // Muestra en la consola el error y envía un mensaje con el error.
      console.error(err);
      return msg.channel.send(`:x: **Error:** ${err.toString()}`).catch((e) => {
        console.error(e);
      });
    } else {
      // Si no hay errores muestre en la consola la salida y/o error del comando ejecutado.
      console.log(stdout + '\n' + stderr);
      // Si está todo actualizado envíe un mensaje indicándolo.
      if (stdout === 'Already up-to-date.') return msg.channel.send(`:white_check_mark: **No hay cambios pendientes.** Todo está en orden.\n\`${stderr}\``);
    }
  });

  // Se recarga el proyecto de Glitch.
  exec('refresh', (err, stdout, stderr) => {
    // Si hay algún error haga lo siguiente.
    if (err) {
      // Muestra en la consola el error y envía un mensaje con el error.
      console.error(err);
      console.error(err);
      msg.channel.send(`:x: **Error:** No se pudieron aplicar los cambios. **(STAGE: refresh --> Glitch)** ${err.toString()}`);
      return msg.channel.send('**Intervención manual requerida**');
    } else {
      // Si no hay errores muestre en la consola la salida y/o error del comando ejecutado.
      console.log(stdout + '\n' + stderr);
      // Si todo salió correctamente envíe un mensaje indicándolo.
      return msg.channel.send(':white_check_mark: **Los cambios fueron aplicados satisfactoriamente.**');
    }
  });
};

exports.aliases = [];
exports.public = false;
exports.description = 'Actualiza los archivos actuales del bot.';
exports.usage = 's!git';
