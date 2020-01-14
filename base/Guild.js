const { Schema, model } = require('mongoose'),
  config = require('../config.js');

module.exports = model(
  'Guild',
  new Schema({
    id: { type: String },
    membersData: { type: Object, default: {} },
    members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    prefix: { type: String, default: config.bot.prefix },
    botQueue: { type: Number, default: 0 },
    logs: {
      type: Object,
      default: {
        enabled: true,
        channel: undefined
      }
    },
    /**
     * Estructura de una sugerencia.
     * [{ sID: 'ID', sContent: 'Contenido de la sugerencia', sMessageID: 'ID del mensaje' }];
     */
    suggestions: {
      type: Array,
      default: []
    }
  })
);
