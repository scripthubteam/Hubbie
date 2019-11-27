const botModel = require('../models/bot');

/**
 * Esta clase administra la colección de los bots
 * @class
 */
class BotsManager {
  /**
     * Esta función agrega un bot a la base de datos
     *
     * @param {String} bot Id del bot
     * @param {String} prefix Prefix del bot
     * @param {String} ownerId Id del owner del bot
     * @return {Promise} Retorna el objeto del bot creado si todo sale bien. Si ocurre un error
     * retorna el error
     */
  addBot(bot, prefix, ownerId) {
    return new Promise(async (resolve, reject) => {
      if (!bot) {
        reject(new Error(`El parametro bot es necesario`));
      }

      if (await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} ya existe en la base de datos`));
      }

      const botsInQueue = await botModel.find({
        approvedDate: 0, // Si el bot no tiene una fecha de aprovación, es decir, no fué aprovado
      });

      await botModel.create({
        botId: bot,
        ownerId,
        prefix,
        nQueue: botsInQueue.length + 1,
      })
          .then((document) => {
            resolve(document);
          })
          .catch((err) => {
            reject(new Error(err));
          });
    });
  }

  /**
     *
     * @param {String} bot Id del bot
     * @return {Promise} Retorna true o false si no hay errores, en caso de error
     * retorna el error
     */
  botExists(bot) {
    return new Promise(async (resolve, reject) => {
      const result = await botModel.exists({botId: bot})
          .catch((err) => {
            reject(err);
          });
      resolve(result);
    });
  }

  /**
     * Obtiene la posición de el bot en la queue
     * @param {String} bot Id de el bot
     * @return {Promise}
     */
  getPositionQueue(bot) {
    return new Promise(async (resolve, reject) => {
      const dbResult = await botModel.findOne({
        botId: bot,
      });
      if (!dbResult) {
        reject(new Error(`No existe el bot ${bot} en la base de datos`));
      }

      resolve(dbResult.nQueue);
    });
  }

  /**
     * Obtiene el objeto de un bot
     * @param {String} bot Id del bot a obtener
     * @return {Promise} Al resolver retorna el bot
     */
  getBot(bot) {
    return new Promise(async (resolve, reject) => {
      try {
        const dbResult = await botModel.findOne({
          botId: bot,
        });
        resolve(dbResult);
      } catch (err) {
        reject(new Error(err));
      }
    });
  }

  /**
     *
     * @return {Promise} Bots no aprovados
     */
  getNoApprovedBots() {
    return new Promise(async (resolve, reject) => {
      const dbResult = await botModel.find({approvedDate: 0})
          .catch((err) => {
            reject(err);
          });
      resolve(dbResult);
    });
  }

  /**
     *
     * @param {String} bot Id del bot
     * @return {Promise} boolean
     */
  isApproved(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} ya está en la base de datos`));
      }
      const dbResult = await botModel.findOne({
        botId: bot,
      })
          .catch((err) => {
            reject(new Error(err));
          });
      if (dbResult.approvedDate === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  /**
     * Acepta un bot que no este aprovado
     * @param {String} bot Id del bot
     * @return {Promise} Boolean
     */
  acceptBot(bot) {
    return new Promise(async (resolve, reject) => {
      if (await !this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      if (await this.isApproved(bot)) {
        reject(new Error(`El bot ${bot} ya está aprovado`));
      }

      const modifiedBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        approvedDate: new Date(),
        nQueue: 0,
      });

      const noApprovedBots = await this.getNoApprovedBots();

      noApprovedBots.forEach(async (bot) => {
        await botModel.findOneAndUpdate({
          botId: bot.botId,
        }, {
          nQueue: bot.nQueue - 1,
        });
      });
      resolve(modifiedBot);
    });
  }

  /**
     * Certifica un bot
     * @param {String} bot id del bot
     * @return {Promise} bot modificado
     */
  certifyBot(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }
      const modifiedBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        certified: true,
      })
          .catch((err) => {
            reject(new Error(err));
          });
      resolve(modifiedBot);
    });
  }

  /**
     * Verifica si el bot está certificado
     * @param {String} bot id del bot
     * @return {Promise} Boolean
     */
  isCertified(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }
      const botDb = await botModel.findOne({
        botId: bot,
      });
      if (botDb.certified) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  /**
     * Elimina un bot
     * @param {String} bot id del bot
     * @return {Promise} bot eliminado
     */
  deleteBot(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }
      const deletedBot = await botModel.findOneAndRemove({
        botId: bot,
      })
          .catch((err) => {
            reject(new Error(err));
          });

      resolve(deletedBot);
    });
  }

  /**
     * @return {Number} retorna la queue
     */
  async getQueue() {
    const noApprovedBots = await this.getNoApprovedBots();
    return noApprovedBots.length;
  }

  /**
     * Rechaza un bot
     * @param {String} bot id del bot
     * @return {Promise} botrechazado
     */
  rejectBot(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const deletedBot = await this.deleteBot(bot);

      const noApprovedBots = await this.getNoApprovedBots();

      noApprovedBots.forEach(async (bot) => {
        await botModel.findOneAndUpdate({
          botId: bot.botId,
        }, {
          nQueue: bot.nQueue - 1,
        });
      });
      resolve(deletedBot);
    });
  }

  /**
     * Obtiene la id del owner de un bot
     * @param {String} bot id del bot
     * @return {Promise} id del owner
     */
  getOwner(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }
      const dbBot = await this.getBot(bot)
          .catch((err) => {
            reject(new Error(err));
          });
      resolve(dbBot.ownerId);
    });
  }

  /**
     * Obtiene los usuarios que votaron
     * @param {String} bot id del bot
     * @return {Promise} Cantidad de votos
     */
  getUsersVote(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }
      const dbBot = await this.getBot(bot)
          .catch((err) => {
            reject(new Error(err));
          });
      resolve(dbBot.votes);
    });
  }

  /**
     * Añade un usuario a la lista de usuarios que votaron
     * @param {String} bot id del bot
     * @param {String} user id del usuario que votó
     * @return {Promise} lista actual de votos
     */
  addVote_(bot, user) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const actualBotVotes = await this.getUsersVote(bot);
      actualBotVotes.push(user);
      await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        votes: actualBotVotes,
      })
          .catch((err) => {
            reject(new Error(err));
          });
      resolve(actualBotVotes);
    });
  }

  /**
     * Obtiene los votos positivos
     * @param {String} bot id del bot
     * @return {Promise} Numero de votos positivos
     */
  getVotesUp(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const dbBot = await this.getBot(bot);
      resolve(dbBot.votes_plus);
    });
  }

  /**
     * Obtiene los votos negativos de un bot
     * @param {String} bot id del bot
     * @return {Promise} numero de votos negativos
     */
  getVotesDown(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const dbBot = await this.getBot(bot);
      resolve(dbBot.votes_negative);
    });
  }

  /**
     * Vota positivamente por un bot
     * @param {String} bot id del bot
     * @param {String} user id del usuario que votó
     * @return {Promise} Bot con el numero actual de votos
     */
  voteUp(bot, user) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      await this.addVote_(bot, user);
      const actualVotesUp = await this.getVotesUp(bot);
      const newBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        votes_plus: actualVotesUp + 1,
      });

      resolve(newBot);
    });
  }

  /**
     * Vota negativamente por un bot
     * @param {String} bot id del bot
     * @param {String} user id del usuario que votó
     * @return {Promise} Bot con el numero actual de votos
     */
  voteDown(bot, user) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      await this.addVote_(bot, user);
      const actualVotesDown = await this.getVotesDown(bot);
      const newBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        votes_plus: actualVotesDown + 1,
      });
      resolve(newBot);
    });
  }

  /**
     * Elimina un voto de la lista de votos
     * @param {String} bot id del bot
     * @param {String} user id del owner del voto a eliminar
     * @return {Promise} voto removido
     */
  deleteVote(bot, user) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const actualVotes = await this.getUsersVote(bot);
      const votesFiltered = actualVotes.filter((id) => id !== user);
      await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        votes: votesFiltered,
      });
      resolve(votesFiltered);
    });
  }

  /**
     * Setea un nuevo prefix para un bot
     * @param {String} bot id del bot
     * @param {String} prefix nuevo prefix
     * @return {Promise} bot con el nuevo prefix
     */
  setPrefix(bot, prefix) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const newBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        prefix,
      });
      resolve(newBot);
    });
  }

  /**
     * Setea una nueva prefix para un bot
     * @param {String} bot id del bot
     * @param {String} description nueva prefix
     * @return {Promise} Retorna el bot con la nueva prefix
     */
  setDescription(bot, description) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const newBot = await botModel.findOneAndUpdate({
        botId: bot,
      }, {
        info: description,
      });

      resolve(newBot);
    });
  }

  /**
     * obtiene la prefix de un bot
     * @param {String} bot
     * @return {Promise} prefix
     */
  getDescription(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const dbBot = await botModel.findOne({botId: bot});

      resolve(dbBot.info);
    });
  }

  /**
     * obtiene el prefix de un bot
     * @param {String} bot
     * @return {Promise} prefix
     */
  getPrefix(bot) {
    return new Promise(async (resolve, reject) => {
      if (!await this.botExists(bot)) {
        reject(new Error(`El bot ${bot} no existe`));
      }

      const dbBot = await botModel.findOne({botId: bot});
      resolve(dbBot.prefix);
    });
  }
}

module.exports = BotsManager;
