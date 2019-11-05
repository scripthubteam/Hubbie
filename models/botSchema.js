const mongoose = require("mongoose")

let botSchema = new mongoose.Schema({
    botId: {
        type: String
    },
    requested: {
        type: Number
    },
    isAppr: {
        type: Boolean,
        default: false
    },
    isQueued: {
        type: Boolean
    },
    nQueue: {
        type: Number
    },
    day: {
        type: Number
    },
    ownerId: {
        type: String
    },
    prefix: {
        type: String
    },
    info: {
        type: String,
        default: "Beep boop, beep?"
    },
    certified: {
        type: Boolean
    },
    votes_plus: {
        type: Number
    },
    votes_negative: {
        type: Number
    },
    vote_players:{
        type: Array
    }
})  

module.exports = mongoose.model("bots", botSchema)