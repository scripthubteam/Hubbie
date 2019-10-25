var db = require("megadb");
var warns = new db.crearDB({nombre: "warns", carpeta: "datos_usuario"});    

exports.run = async (bot, msg, args) => {

  var canal = bot.channels.get("606340576740114433")
  const prev = "WarnStorage_"
  const human = msg.mentions.users.first()
  if (!human) return msg.channel.send("Es necesario especificar un usuario.")
  const dbs = prev+human.id;
  var reason = args[1]
  if (!reason) return msg.channel.send("```[WARN]\nEs necesario especificar un motivo. El mismo debe ser una codificación de los listados debajo.\nListado de motivos:\na1::Mal comportamiento reiterado.\na2::Discriminación, racismo, xenofobia, homofobia, etc.\nb1::Autopromoción (spam)\nc1::No respeta la temática de los canales en forma reiterada.\nc2::Nulo conocimiento sobre programación/librerías y nada de motivación para aprender.\nd1::Negarse a seguir las reglas planteadas en el servidor.\nd2::Incumplir los términos de servicio planteados por Discord.\ne1::Reiterada insistencia en que otros programen su código.\ne2::Falsa información/plagio hacia una persona, ente o trabajo previamente hecho por otra persona\n\n\n\n```")

  const arrayReasons = ["Mal comportamiento reiterado.", "Discriminación, racismo, xenofobia, homofobia, etc.",
                               "Autopromoción (spam)", "No respeta la temática de los canales en forma reiterada.",
                               "Nulo conocimiento sobre programación/librerías y nada de motivación para aprender.", "Negarse a seguir las reglas planteadas en el servidor.",
                               "Incumplir los términos de servicio planteados por Discord.", "Reiterada insistencia en que otros programen su código.",
                               "Falsa información/plagio hacia una persona, ente o trabajo previamente hecho por otra persona"]

  if (reason === "a1") reason = arrayReasons[0]; else if (reason === "a2") reason = arrayReasons[1];
  else if (reason === "b1") reason = arrayReasons[2]; else if (reason === "c1") reason = arrayReasons[3];
  else if (reason === "c2") reason = arrayReasons[4]; else if (reason === "d1") reason = arrayReasons[5];
  else if (reason === "d2") reason = arrayReasons[6]; else if (reason === "e1") reason = arrayReasons[7];
  else if (reason === "e2") reason = arrayReasons[8]; else return msg.channel.send("Debes escoger alguna norma");

  var reasonsConv = {
     a1: arrayReasons[0], a2: arrayReasons[1], b1: arrayReasons[2], c1: arrayReasons[3],
     c2: arrayReasons[4], d1: arrayReasons[5], d2: arrayReasons[6], e1: arrayReasons[7],
     e2: arrayReasons[8]
  }

  if (!warns.has(dbs+"warn.amount")) {
      await warns.add(dbs+"warn.amount", 1)
      await warns.set(dbs+"warn.reasons", [])
      await warns.push(dbs+"warn.reasons", reason)
  }
  
  if (warns.get(dbs+"warn.amount") > 3 || warns.get(dbs+"warn.amount") < 4) {
        human.send(`Has sido advertido por ${reason} - **Staff:** ${msg.author.tag}`)
        human.send("Además, has acumulado `3 (tres) advertencias`. El equipo de Script Hub se reserva el derecho a expulsarte de la comunidad cuando lo crean necesario.")
  }

  human.send(`Has sido advertido por ${reason} - **Staff:** ${msg.author.tag}`)
  msg.channel.send("> El miembro **"+human.tag+"** ha sido advertido por no haber acatado la norma:\n> `"+reason+"`")
};
