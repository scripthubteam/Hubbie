require('dotenv').config()
// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

const Discord = require("discord.js"),
  bot = new Discord.Client(),
  ms = require("ms"),
  pms = require("pretty-ms"),
  moment = require("moment"),
  db = require("megadb"),
  fs = require("fs");

function log(m) {
  console.log("[" + 1 * 2 + "] " + m);
}

/* Controlador de eventos */

fs.readdir("./events/", (err, files) => {
  if (err) return console.log(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    const eventName = file.split(".")[0];
    console.log(event);
    bot.on(eventName, event.bind(null, bot));
  });
});

/* Controlador de comandos */
bot.on("message", msg => {
  const prefix = process.env.PREFIX
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (msg.author.bot || !msg.content.startsWith(prefix)) return;

  try {
    var cmdFile = require("./comandos/" + cmd + ".js");
    cmdFile.run(bot, msg, args);
  } catch (err) {
    msg.channel.send(":x: | Hubo un error al ejecutar el comando deseado.");
    log(err);
  }
});

bot.login(process.env.TOKEN);
