const ticketModel = require('../models/ticket');

/**
 * AYÚDENME, POR FAVOR PORQUE NO SÉ QUE CARAJO PAS
 * escribamos acá (?) no discord
 * Pienso que SI
 */
class TicketSystem {
  createTicket(id) {
    return new Promise(async (resolve, reject) => {
      if (!id) {
        reject(new Error(`El parametro id es necesario`));
      }
      if (await this.ticketExists(id)) {
        reject(new Error(`El usuario con id ${id} ya tiene un ticket abierto.`));
      }
      await ticketModel.create({
        userId: id,
      })
          .then((document) => {
            resolve(document);
          })
          .catch((err) => {
            reject(new Error(err));
          });
    });
  }
  ticketExists(id) {
    return new Promise(async (resolve, reject) => {
      const result = await ticketModel.exists({userId: id})
          .catch((err) => {
            reject(err);
          });
      resolve(result);
    });
  }
  closeTicket(id) {
    return new Promise(async (resolve, reject) => {
      if (!await this.ticketExists(id)) {
        reject(new Error(`El usuario con id ${id} no tiene un ticket abierto.`));
      }
      const deleteId = await ticketModel.findOneAndRemove({
        userId: id,
      })
          .catch((err) => {
            reject(new Error(err));
          });

      resolve(deleteId);
    });
  }
}

module.exports = TicketSystem;
