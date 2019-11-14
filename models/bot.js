onst { Schema, model } = require("mongoose");

const botSchema = new Schema({
  ownerId: {
  _id: {
    type: String
  },
  nQueue: {
  idOwner: {
    type: String
  },
  queuePosition: {
    type: Number
  },
  prefix: {
    type: Number,
    default: 0
  },
  info: {
  description: {
    type: String,
    default: "Un bot simple"
  },
  certified: {
  verified: {
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