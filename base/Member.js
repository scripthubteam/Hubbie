const { Schema, model } = require('mongoose');

module.exports = model(
  'Member',
  new Schema({
    id: { type: String },
    guildID: { type: String },
    moderation: {
      warns: {
        type: Array,
        default: []
      },
      cases: {
        type: Array,
        default: []
      }
    }
  })
);
 /**
  * Estructura de moderación.
  * En cases abarca veto y expulsión.
  * cases: [
  *   { mType: 'kick || ban', mID: 'ID del caso', mReason: 'Razón del caso', mMod: 'Autor del caso' }
  * ]
  */