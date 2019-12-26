const {Schema, model} = require('mongoose');

const ticketSchema = new Schema({
  userId: {
    type: String,
  },
  ticketStatus: {
    type: Number, // Lau, ocupamos saber qué estado es :wot:
  },
});

module.exports = model('ticket', ticketSchema);
