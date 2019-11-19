//dotenv
require('dotenv').config()
// Iniciamos un servidor web en el puerto por defecto para que Glitch no detecte errores.
const express = require("express");
const app = express();

app.get("*", (req, res) => {
    res.send("No quedará en la noche una estrella.\nNo quedará la noche.\nMoriré y conmigo la suma\ndel intolerable universo.\nBorraré las pirámides, las medallas,\nlos continentes y las caras.\nBorraré la acumulación del pasado.\nHaré polvo la historia, polvo el polvo.\nEstoy mirando el último poniente.\nOigo el último pájaro.\nLlego la nada a nadie.\n");
});

app.listen(process.env.PORT || 3000, (e) => {
            console.log(`${e ? `${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}` : "Página web lista!"}`);
});

// Código del bot en sí.
const Discord = require("discord.js");
const mongoose = require("mongoose");
const client = new Discord.Client();
const moment = require('moment');
const path = require("path");
const fs = require("fs");
const log = (message) => {
  console.log(`[${moment().format("MM-DD-YYYY HH:mm:ss")}] ${message}`);
};

// Bot Modules
const errorLog = require("./bot_modules/errorLog.js");

// Conectando a base de datos MongoDB.
mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (e) => {
  console.log(`${e ? `${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}` : `Base de datos lista!`}`);
});

// Cuando el cliente esté listo.
client.on("ready", () => {
  // Señal de vida.
  console.log(client.user.tag+" ("+process.env.PREFIX+") - Listo!");
  client.user.setActivity("Documentación y bots", {type: 'WATCHING'}).catch();
  // Definiciones importantes y administrador de comandos (1/3).
  client.onlyDeleteUsers = [];
  client.db = require("./models/bot.js");
  client.cmds = new Discord.Collection();
  client.aliases = new Discord.Collection();

//Eventos
fs.readdir('./events/', (err, files) => {
  if (err) throw err;
  log(`[Eventos] [Cargando un total de ${files.length} eventos]`);

  files.forEach((f) => {
    const event = require(`./events/${f}`);
    const eventName = f.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${f}`)];
  });
});

//Comandos
fs.readdir("./cmds/", (err, files) => {
  if (err) errorLog(err);
  
  log(`[Comandos] [Cargando un total de ${files.length} comandos]`);
  files.forEach(f => {
    let props = require(`./cmds/${f}`);
    let commandName = f.split('.')[0];
    log(`Comando cargado: ${f}.`);
    client.cmds.set(commandName, {
      runFile: props,
      name: f.split('.')[0],
      public: props.public,
      aliases: props.aliases,
      description: props.description,
      usage: props.usage
    });
  
  });
});
});

// Controlamos todas las excepciones recibidas que no han sido controladas anteriormente.
process.on("unhandledRejection", e => {
  // Se envía todo eso en la consola.
  errorLog(e);
  console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
});

// Iniciamos sesión en el bot con su token correspondiente y si hay algún error lo muestra.
client.login(process.env.TOKEN).catch((e) => {
  errorLog(e);
  console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
});