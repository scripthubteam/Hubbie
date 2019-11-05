const mongoose = require("mongoose")

let queuedBotSchema = new mongoose.Schema({
    globalQueued: {
        type: Number
    }
})

module.exports = mongoose.model("queue", queuedBotSchema)