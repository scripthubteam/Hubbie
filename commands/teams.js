const { RichEmbed } = require("discord.js");
const _ = require("lodash");
exports.run = async (client, msg, args) => {
  let teamroles = {
    staff: {
      id: "606222350228127765"
    },
    ceo: {
      id: "655471030231367680"
    },
    representantes: {
      id: "643142453234368542"
    },
    tecnico: {
      id: "643142668657885224"
    },
    comunidad: {
      id: "606256558208319489"
    },
    soporte: {
      id: "606346140413329409"
    },
    diseñadores: {
      id: "648315006915706890"
    },
    semana: {
      id: "656674375193591808"
    },
    programadores: {
      id: "644311662786117633"
    },
    boosters: {
      id: "609107740031189028"
    },
    donadores: {
      id: "607636342226288670"
    },
    verificados: {
      id: "658347885787873310"
    },
    contribuidores: {
      id: "631932020553154580"
    },
    redactores: {
      id: "608364944785801406"
    },
    bugs: {
      id: "643103803163541535"
    },
    partners: {
      id: "632685312295960581"
    },
    muteados: {
      id: "654399652342267934"
    },
    libreria: {
      id: "614518901086224424"
    },
    clubbots: {
      id: "606678494482661378"
    }
  };
  try {
    let teamkeys = Object.keys(teamroles);
    let teamvalues = Object.values(teamroles);
    if (!args[0])
      return msg.channel.send(
        ":x: | Los equipos validos son: `" + teamkeys.join(", ") + "`"
      );
    for (let x in teamkeys) {
      for (let y in teamvalues) {
        if (args[0] === teamkeys[x] && x === y) {
          let membersrole = client.guilds
            .get("606199542605414428")
            .roles.get(teamvalues[y].id)
            .members.array()
            .map(u => u.user.tag);

          if (membersrole.length <= 0)
            return msg.channel.send(
              ":x: | **Este equipo no tiene miembros aún.**"
            );
          let embed = new RichEmbed();
          let namerole = teamkeys[x];
          let name = namerole.charAt(0).toUpperCase() + namerole.slice(1);
          if (namerole === "comunidad" || namerole === "tecnico") {
            namerole = "Departamento " + name;
            name = namerole;
          }
          if (namerole === "ceo") {
            name = "CEO";
          }
          embed
            .setTitle("🛡️🎏 | Miembros de " + name)
            .setColor(0xf7671e)
            .setDescription(
              ">>> ```" +
                membersrole.join("\n") +
                " ```\n ◈ Hay un total de **" +
                membersrole.length +
                "** miembro(s) en este equipo."
            )
            .setTimestamp();
          msg.channel.send(embed);
          return;
        }
      }
    }
    msg.channel.send(
      ":x: | **Equipo inválido.** Los equipos validos son: `" +
        teamkeys.join(", ") +
        "`"
    );
    return;
  } catch (e) {
    console.error(e);
  }
};

exports.aliases = ["equipos", "team", "equipo"];
exports.public = true;
exports.description = "Listado de equipos de Script Hub Team.";
exports.usage = "s!teams <equipo>";
