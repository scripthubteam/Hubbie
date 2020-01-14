const { Schema, model } = require("mongoose");

module.exports = model(
  "Bot",
  new Schema({
    id: { type: String },
    nQueue: { type: Number },
    invited: false,
    accepted: false,
    info: {
      type: Object,
      ownerID: { type: String },
      prefix: { type: String },
      description: { type: String, default: "Un simple bot." },
      verified: { type: Boolean, default: false },
      votes: {
        type: Object,
        up: { type: Number, default: 0 },
        down: { type: Number, default: 0 },
        voters: {
          type: Array
        }
      },
      nota: {
        type: Array
      }
    },
    invite: {
      type: Object,
      state: { type: Number, default: 0 }, // 0: Sin respuesta | 1: Aceptado | 2: Denegado
      messageID: { type: String }
    },
    roles: {
      type: Array
    }
  })
);
