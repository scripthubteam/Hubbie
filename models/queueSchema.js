const mongoose = require("mongoose")

let queuedBotSchema = new mongoose.Schema({
    serverId: {
        type: String
    },
    globalQueued: {
        type: Number
    }
})

module.exports = mongoose.model("queue", queuedBotSchema)