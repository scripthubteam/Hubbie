const db = require("../db/db.js");

let Reg = db.loadRegHelper(),
    Warns;

Reg.init("Warns", "{}");

if (typeof Warns == 'undefined') {
    Warns = {};
    try {
        Warns = JSON.parse(Reg.get("Warns"));
    } catch (e) {
        Warns = {};
    }
}

exports.run = async (bot, msg, args) => {
    if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(":x: No posees los permisos necesarios.")

    var ment = msg.mentions.members.first();
    var argData = args.join(" ");
    var parts = argData.split(" "),
        reason = parts[1];
    
    if (!ment) {
        msg.channel.send(":x: Menciona a un usuario.");
        return;
    }

    if (!Warns[ment.id]) Warns[ment.id] = {
        "cantidad": 0,
        "razones": []
    };

    Reg.save("Warns", JSON.stringify(Warns));

    if (!reason) {
        Warns[ment.id].cantidad += 1;
        Reg.save("Warns", JSON.stringify(Warns));
        ment.send("Fuíste amonestado por el Moderador(a): **"+msg.author.tag+"**\nNo se especificó un motivo, si necesita una explicación contáctese con **"+msg.author.tag+"**");
        msg.channel.send("Se amonestó correctamente a "+ment.user.username);
        return;
    } else {
        Warns[ment.id].cantidad += 1;
        var toPush = Warns[ment.id].razones;
        toPush.push(reason);
        Reg.save("Warns", JSON.stringify(Warns));
        ment.send("Fuíste amonestado por el Moderador(a): **"+msg.author.tag+"**\nMotivo de la sanción:\n```"+reason+"```").catch(() => msg.channel.send("El usuario tiene los dm desactivados."));
        msg.channel.send("Se amonestó correctamente a "+ment.user.username);
        return;
    }

};