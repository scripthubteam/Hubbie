const { RichEmbed } = require("discord.js");
const _ = require("lodash");
const Command = require('../../base/Command.js');

module.exports = class Teams extends Command {
    constructor(client) {
        super(client, {
            name: 'team',
            description: 'Muestra los equipos existentes de Script Hub.',
            usage: prefix => `\`${prefix}team [nombre de equipo]\``,
            examples: prefix => `\`${prefix}team CEO\``,
            enabled: true,
            ownerOnly: false,
            guildOnly: false,
            aliases: ['equipo', 'equipos', 'teams'],
            memberPermissions: [],
            dirname: __dirname
        });
    }
    async run(message, args) {
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
            destacados: {
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
            cazadores: {
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
            bots: {
                id: "606678494482661378"
            },
            veteranos: {
                id: "667451379387858964"
            },
            soporte: {
                id: "606346140413329409"
            }
        };
        try {
            let teamkeys = Object.keys(teamroles);
            let teamvalues = Object.values(teamroles);
            if (!args[0])
                return message.channel.send(
                    ":x: | Los equipos existentes son: `" + teamkeys.join(", ") + "`"
                );
            for (let x in teamkeys) {
                for (let y in teamvalues) {
                    if (args[0] === teamkeys[x] && x === y) {
                        let membersrole = this.client.guilds
                            .get("606199542605414428")
                            .roles.get(teamvalues[y].id)
                            .members.array()
                            .map(u => u.user.tag);

                        if (membersrole.length <= 0)
                            return message.channel.send(
                                ":x: | **Este equipo no tiene miembros aún.**"
                            );
                        let embed = new RichEmbed();
                        let namerole = teamkeys[x];
                        let name = namerole.charAt(0).toUpperCase() + namerole.slice(1);
                        if (namerole === "bots") {
                            let getallbots = await this.client.botsys.getAllBots();
                            if (_.isEmpty(getallbots)) {
                                message.channel.send(":x: | El **Club de Bots** está vacio.");
                                return;
                            }
                            for (let x in getallbots) {
                                embed
                                    .setTitle("🛡️🎏 | Club de Bots")
                                    .setColor(0xf7671e)
                                    .setDescription(
                                        ">>> ```" +
                                        this.client.users.get(getallbots[x].id).tag +
                                        " ```"
                                    )
                                    .setTimestamp();
                                message.channel.send(embed);
                                return;
                            }
                            return;
                        }

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
                        message.channel.send(embed);
                        return;
                    }
                }
            }
            message.channel.send(
                ":x: | **Equipo inválido.** Los equipos validos son: `" +
                teamkeys.join(", ") +
                "`"
            );
            return;
        } catch (e) {
            console.error(e);
        }
    }
};

