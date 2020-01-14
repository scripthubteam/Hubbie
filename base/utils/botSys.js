let botsData = require("../Bot");

module.exports = {
  async findOrCreateBot(param, isLean) {
    return new Promise(async function (resolve, reject) {
      let botData = isLean
        ? await botsData.findOne(param).lean()
        : await botsData.findOne(param);
      if (botData) {
        botData.save = async function () {
          await botsData
            .where({ _id: botData._id })
            .updateOne({ $set: botData });
          botData = await botsData.findOne(param).lean();
          return botData;
        };
        resolve(botData);
      } else {
        botData = new botsData(param);
        await botData.save();
        botData.save = async function () {
          await botsData
            .where({ _id: botData._id })
            .updateOne({ $set: botData });
          botData = await botsData.findOne(param).lean();
          return botData;
        };
        resolve(isLean ? botData.toJSON() : botData);
      }
    });
  },
  async botExists(id) {
    return new Promise(async (resolve, reject) => {
      const result = await botsData.exists({ id: id }).catch(err => {
        reject(err);
      });
      resolve(result);
    });
  },
  /**
   * Elimina un bot
   * @param {String} id id del bot
   * @return {Promise} bot eliminado
   */
  async deleteBot(id) {
    return new Promise(async (resolve, reject) => {
      if (!(await this.botExists(id))) {
        reject(new Error(`El bot ${id} no existe`));
      }
      const deletedBot = await botsData
        .findOneAndRemove({
          id: id
        })
        .catch(err => {
          reject(new Error(err));
        });
      resolve(deletedBot);
    });
  },
  async getBot(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const dbResult = await botsData.findOne({
          id: id
        });
        resolve(dbResult);
      } catch (err) {
        reject(new Error(err));
      }
    });
  },
  async getAllBots() {
    return new Promise(async (resolve, reject) => {
      try {
        const dbResult = await botsData.find()
        resolve(dbResult);
      } catch (err) {
        reject(new Error(err));
      }
    });
  }
};
