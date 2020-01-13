const util = require('util'),
  fs = require('fs'),
  path = require('path'),
  Client = require('./base/Hubbie'),
  readdir = util.promisify(fs.readdir),
  client = new Client({ ws: { properties: { $browser: 'Discord iOS' } } }),
  mongoose = require('mongoose'),
  init = async () => {
    let directories = await readdir('./commands');
    directories.forEach(async dir => {
      let commands = await readdir('./commands/' + dir + '/');
      commands
        .filter(cmd => cmd.split('.').pop() === 'js')
        .forEach(cmd => {
          let response = client.loadCommands('./commands/' + dir, cmd);
          if (response) {
            console.log(response);
          }
        });
    });
    let evtFiles = await readdir('./events/');
    evtFiles.forEach(file => {
      let eventName = file.split('.')[0];
      let event = new (require(`./events/${file}`))(client);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`./events/${file}`)];
    });

    client.login(client.config.tokens.bot);

    mongoose
      .connect(client.config.tokens.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('¡Conectando con la base de datos!');
      })
      .catch(err => {
        console.log('¡No se ha podido contectar a la base de datos!\nError:');
        console.error(err);
      });
  };

init();
