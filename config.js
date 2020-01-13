require('dotenv').config();
let env = process.env;
module.exports = {
  tokens: {
    bot: env.tokBot,
    mongodb: env.tokMongodb
  },
  bot: {
    prefix: env.botPrefix
  },
  owners: [env.ownLau, env.ownDev, env.ownMon],
  servidor: {
    id: env.servID,
    categorias: {
      info: {
        id: env.catInfo,
        canales: {
          intro: env.chanIntro,
          rules: env.chanRules,
          casos: env.chanCases
        }
      },
      comunidad: {
        id: env.catCom,
        canales: {
          global: env.chanGlobal,
          sugerencias: env.chanSuggs,
          proyectos: env.chanProjects
        }
      },
      staff: {
        id: env.catStaff,
        canales: {
          request: env.chanRequest,
          logs: env.chanLogs
        }
      },
      langs: {
        id: env.catLangs
      },
      tickets: {
        id: env.catTickets,
        canales: {}
      },
      bots: {
        id: env.catBots,
        canales: {
          invitar: env.chanInvite,
          playground: env.chanPlay
        }
      }
    },
    roles: {
      staff: {
        sht: env.roleSHT,
        ceo: env.roleCEO,
        representantes: env.roleRep,
        departamento: {
          comunidad: env.roleDepCom,
          tecnico: env.roleDepTec
        }
      },
      comunidad: {
        verificado: env.roleVeri,
        usuario: env.roleUser
      },
      bots: {
        gen: env.roleBotsGen,
        club: env.roleClub,
        test: env.roleTest
      }
    }
  }
};
