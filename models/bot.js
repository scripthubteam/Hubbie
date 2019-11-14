const { Schema, model } = require("mongoose");

const botSchema = new Schema({
  _id: {
    type: String
  },
  ownerId: {
    type: String
  },
  nQueue: {
    type: Number
  },
  prefix: {
    type: String
  },
  approvedDate: {
    type: Number,
    default: 0
  },
  info: {
    type: String,
    default: "Un bot simple"
  },
  certified: {
    type: Boolean,
    default: false
  },
  requested:{
    type: Number
  },
  votes: {
    type: Array,
    default: []
  },
  votes_plus:{
    type: Number
  },
  votes_neegative:{
    type: Number
  }
});

exports.bots = model("bots", botSchema);