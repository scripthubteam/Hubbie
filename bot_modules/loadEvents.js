const moment = require('moment');
const log = (message) => {
  console.log(`[${moment().format("MM-DD-YYYY HH:mm:ss")}] ${message}`);
};

const fs = require('fs')

module.exports = async (dir, client) => {

	/*
	* Verificamos el directorio ingresado exista
	*/

	if(!fs.existsSync(dir)) return client.errorLog(`[Eventos] El directorio ingresado no existe`)

	/*
	* Verificamos los archivos del directorio sean .js
	*/

	let files = await fs.readdirSync(dir).filter(x => x.endsWith('.js'))

	/*
	* Verificamos que los archivos filtrados sea mayor a 1 si no devulvera un error diciendo que el directorio no contiene ningun archivo
	*/

	if(files.length < 1) return client.errorLog(`[Eventos] El directorio ingresado no contiene ningun evento`)

  	log(`[Eventos] [Cargando un total de ${files.length} eventos]`);

	for(var f of files) {
  		try {
		    const event = require(`${dir}/${f}`);
	    	const eventName = f.split('.')[0];
    		client.on(eventName, event.bind(null, client));
    		delete require.cache[require.resolve(`${dir}/${f}`)];
		} catch(e) {
			client.errorLog(`[Error] No se pudo cargar el evento (${f.split('.')[0]})
Motivo: ${e}`)
		} finally {
			log(`[Eventos] Se cargo correctamente el evento (${f.split('.')[0]})`)
		}

 	}

 	return true

}