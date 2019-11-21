module.exports = function (e) {
	if(!e) throw new Error("[ERRORLOG - MODULE] Falta el error.");
	const fs = require("fs");
	var log = fs.createWriteStream('./bot_logs/errors.txt', { flags: 'a' });
	log.write('[ERROR][ID #'+Date.now()+'] Log del error: '+e+' \n');
	console.error("[ERRORLOG][ID #'+Date.now()+']: "+e);
};