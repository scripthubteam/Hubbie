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
client.errorLog = require("./bot_modules/errorLog.js");

/*
* Usaremos una funcion para iniciar al bot de manera sincronizada para evitar posibles fallas 
*/

const loadCommands = require('./bot_modules/loadCommands')
const loadEvents = require('./bot_modules/loadEvents')

const init = async () => {

  // Conectando a base de datos MongoDB.
  await mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (e) => {
    console.log(`${e ? `${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}` : `Base de datos lista!`}`);
  }).catch(e => {
    throw new Error('No se pudo realizar la conexion a la base de datos')
  });


  client.onlyDeleteUsers = [];
  client.db = require("./models/bot.js");
  client.cmds = new Discord.Collection();
  client.aliases = new Discord.Collection();

  //Usaremos las funciones loadEvents y loadCommands para iniciar el bot de manera sincronizada
  await loadEvents(path.resolve(__dirname, 'events'), client)
  await loadCommands(path.resolve(__dirname, 'cmds'), client)

 // Iniciamos sesión en el bot con su token correspondiente y si hay algún error lo muestra.
  client.login(process.env.TOKEN).catch((e) => {
   errorLog(e);
   console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
  });
}

// Controlamos todas las excepciones recibidas que no han sido controladas anteriormente.
process.on("unhandledRejection", e => {
  // Se envía todo eso en la consola.
  client.errorLog(e);
  console.error(`${e.toString()}${e.fileName ? ` - ${e.fileName}:${e.lineNumber}:${e.columnNumber}` : ``}`);
});

init()
