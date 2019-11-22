const fs = require("fs");
const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));

module.exports = async (e) => {
	if(!e) throw new Error("[ERRORLOG - MODULE] Falta el error.");

	let check = await fileExists('./bot_logs/errors.txt')

	if(!check) await fs.writeFile('./bot_logs/errors.txt', '', { overwrite: false }, function (err) {
  		if (err) throw err;
  		console.log('[ERRORLOG - MODULE] Directorio de errores creado.');
	});

	var log = fs.createWriteStream('./bot_logs/errors.txt', { flags: 'a' });
	log.write('[ERROR][ID #'+Date.now()+'] Log del error: '+e+' \n');
	console.error("[ERRORLOG][ID #"+Date.now()+"]: "+e)
	return false
};