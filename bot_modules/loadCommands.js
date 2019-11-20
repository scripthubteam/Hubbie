const moment = require('moment');
const log = (message) => {
  console.log(`[${moment().format("MM-DD-YYYY HH:mm:ss")}] ${message}`);
};

const fs = require('fs')

module.exports = async (dir, client) => {
	
	/*
	* Verificamos el directorio ingresado exista
	*/

	if(!fs.existsSync(dir)) return client.errorLog(`[Comandos] El directorio ingresado no existe`)

	/*
	* Verificamos los archivos del directorio sean .js
	*/

	let files = await fs.readdirSync(dir).filter(x => x.endsWith('.js'))

	/*
	* Verificamos que los archivos filtrados sea mayor a 1 si no devulvera un error diciendo que el directorio no contiene ningun archivo
	*/
  
  	log(`[Comandos] Se detectaron un total de ${files.length} comandos`)
  	log(`[Comandos] Iniciando carga de comandos`)

  	for(var f of files) {

  	try {

    let props = require(`${dir}/${f}`);
    
    let commandName = f.split('.')[0];
    
    client.cmds.set(commandName, {
      runFile: props,
      name: f.split('.')[0],
      public: props.public,
      aliases: props.aliases,
      description: props.description,
      usage: props.usage
    });

	} catch(e) {
		client.errorLog(`[Comandos] No se pudo cargar el comando (${f.split('.')[0]})`)
	} finally {
		log(`Comando cargado: ${f}.`);
	}

	}

}