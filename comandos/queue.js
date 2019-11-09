const bots = require("../models/botSchema")

exports.run = async (bot, msg, args) => {

    if (isNaN(args[0])) {
        msg.channel.send(":x: **Esa no es una ID válida.** La ID debe contener el número del cliente de la apliación/usuario.");
        return;
    }

    var user = await bot.fetchUser(args[0]);
    var dbBot = await bots.findOne({
        botId: user.id
    });

    if (dbBot !== null) {
        if (dbBot.isQueued) {
            msg.channel.send("La poscición de **"+user.tag+"** en la cola es de **"+dbBot.nQueue+"**");
            return;
        } else {
            msg.channel.send(":x: Este bot no está en la cola de espera.")
        }
    } else {
        msg.channel.send(":x: Este bot no está en nuestra base de datos.");
        return;
    }

}