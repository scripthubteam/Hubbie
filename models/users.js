const {Schema, model} = require('mongoose');

const botSchema = new Schema({
  userId: {
    type: String,
  },
  helpPoints: {
    type: Number,
  },
  chatPoints: {
    type: Number,
  },
  pointBooster: {
    type: Boolean,
  }
});

module.exports = model('users', botSchema);
