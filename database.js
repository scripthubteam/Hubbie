const { Schema, model } = require("mongoose");

const botSchema = new Schema({
  _id: {
    type: String
  },
  idOwner: {
    type: String
  },
  queuePosition: {
    type: Number
  },
  prefix: {
    type: String
  },
  approvedDate: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: "Un bot simple"
  },
  verified: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Array,
    default: []
  }
});

exports.bots = model("ClubBots", botSchema);