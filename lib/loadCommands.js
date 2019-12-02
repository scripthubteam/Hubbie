const fs = require('fs');

async function loadCommands(dir, client) {
  if (!fs.existsSync(dir)) return console.error(`[Comandos] El directorio ingresado no existe`);

  /*
     * Verificamos los archivos del directorio sean .js
     */

  const files = fs.readdirSync(dir).filter((x) => x.endsWith('.js'));

  /*
     * Verificamos que los archivos filtrados sea mayor a 1 si no devulvera un error diciendo que el directorio no contiene ningun archivo
     */

  console.log(`[Comandos] Se detectaron un total de ${files.length} comandos`);
  console.log(`[Comandos] Iniciando carga de comandos`);

  for (const file of files) {
    try {
      const props = require(`${dir}/${file}`);

      const commandName = file.split('.')[0];

      client.cmds.set(commandName, {
        runFile: props,
        name: file.split('.')[0],
        public: props.public,
        aliases: props.aliases,
        description: props.description,
        usage: props.usage,
      });
      console.log(`Comando cargado: ${file}.`);
    } catch (err) {
      console.error(`[Comandos] No se pudo cargar el comando (${file.split('.')[0]}) error: ${err}`);
    }
  }
}

module.exports = loadCommands;
