const path = require('path');

module.exports = class Command {
  constructor(
    client,
    {
      name = undefined,
      description = 'Descripción del comando',
      usage = '`Uso del comando`',
      examples = '`Ejemplo de uso`',
      enabled = true,
      ownerOnly = false,
      guildOnly = false,
      aliases = [],
      memberPermissions = [],
      dirname = undefined
    }
  ) {
    this.client = client;
    let category = dirname
      ? dirname.split(path.sep)[
          parseInt(dirname.split(path.sep).length - 1, 10)
        ]
      : 'Otro';
    this.config = {
      enabled,
      ownerOnly,
      guildOnly,
      aliases,
      memberPermissions
    };
    this.help = {
      name,
      description,
      category,
      usage,
      examples
    };
  }
};
