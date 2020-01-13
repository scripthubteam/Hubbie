const { Schema, model } = require('mongoose');

module.exports = model(
  'User',
  new Schema({
    id: { type: String },
    tickets: {
      reason: { type: String, default: 'Necesito ayuda.' },
      channel: { type: String },
      status: false
    }
  })
);
