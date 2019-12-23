// dotenv
require('dotenv').config();
// Iniciamos un servidor web en el puerto por defecto para que Glitch no detecte errores.
const express = require('express');
const app = express();

app.get('*', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Pagina web lista`);
});

// Código del bot en sí.
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
const path = require('path');

/*
 * Usaremos una funcion para iniciar al bot de manera sincronizada para evitar posibles fallas
 */

const loadCommands = require('./lib/loadCommands');
const loadEvents = require('./lib/loadEvents');

async function init() {
  // Conectando a base de datos MongoDB.
  await mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }, (err) => {
    if (err) {
      console.error(err.toString());
    }
    console.log(`${err ? `${err.toString()}${err.fileName ? ` - ${err.fileName}:${err.lineNumber}:${err.columnNumber}` : ``}` : `Base de datos lista!`}`);
  }).catch((err) => {
    console.error(err);
  });

  client.onlyDeleteUsers = [];
  client.cmds = new Discord.Collection();
  client.aliases = new Discord.Collection();

  await loadEvents(path.join(__dirname, 'events'), client);
  await loadCommands(path.join(__dirname, 'commands'), client);
  client.login(process.env.TOKEN)
      .catch((err) => {
        console.error(err);
      });
};

// Controlamos todas las excepciones recibidas que no han sido controladas anteriormente.
process.on('unhandledRejection', (err) => {
  console.error(err);
});

init();
