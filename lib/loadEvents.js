const fs = require('fs');

async function loadEvents(dir, client) {
  if (!fs.existsSync(dir)) return console.error(`[Eventos] El directorio ingresado no existe`);

  const files = fs.readdirSync(dir).filter((x) => x.endsWith('.js'));

  if (files.length < 1) return console.log(`[Eventos] El directorio ingresado no contiene ningun evento`);

  console.log(`[Eventos] [Cargando un total de ${files.length} eventos]`);

  for (const fileName of files) {
    try {
      const event = require(`${dir}/${fileName}`);
      const eventName = fileName.split('.')[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`${dir}/${fileName}`)];
      console.log(`[Eventos] Se cargo correctamente el evento (${fileName.split('.')[0]})`);
    } catch (err) {
      console.error(`[Error] No se pudo cargar el evento (${fileName.split('.')[0]}) Motivo: ${err}`);
    }
  }

  return true;
}
module.exports = loadEvents;
