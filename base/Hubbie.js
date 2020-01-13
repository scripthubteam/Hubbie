let { Client, Collection } = require("discord.js"),
  util = require("util"),
  path = require("path");

module.exports = class client extends Client {
  constructor(options) {
    super(options);
    this.config = require("../config.js");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.usersData = require("./User");
    this.guildsData = require("./Guild");
    this.membersData = require("./Member");
    this.botsData = require("./Bot");
    this.functions = require("./utils/functions");
    this.botsys = require("./utils/botSys");
    this.colors = {
      red: 0xf04947,
      yel: 0xf1c40f,
      gre: 0x43b581,
      hub: "ORANGE"
    };
  }
  loadCommands(commandPath, commandName) {
    try {
      const props = new (require(`.${commandPath}${path.sep}${commandName}`))(
        this
      );
      console.log(`Cargando comando: ${props.help.name} 👌`);
      props.config.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.config.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      console.error(e);
      return `No se pudo cargar el comando: ${commandName} Error: ${e}`;
    }
  }
  async findOrCreateUser(param, isLean) {
    let usersData = this.usersData;
    return new Promise(async function (resolve, reject) {
      let userData = isLean
        ? await usersData.findOne(param).lean()
        : await usersData.findOne(param);
      if (userData) {
        userData.save = async function () {
          await usersData
            .where({ _id: userData._id })
            .updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(userData);
      } else {
        userData = new usersData(param);
        await userData.save();
        userData.save = async function () {
          await usersData
            .where({ _id: userData._id })
            .updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(isLean ? userData.toJSON() : userData);
      }
    });
  }
  async findOrCreateGuild(param, isLean) {
    let guildsData = this.guildsData;
    return new Promise(async function (resolve, reject) {
      let guildData = isLean
        ? await guildsData
          .findOne(param)
          .populate("membersData")
          .lean()
        : await guildsData.findOne(param).populate("membersData");
      if (guildData) {
        guildData.save = async function () {
          this.guildsData = guildsData;
          this.guildsData = guildsData;
          await this.guildsData
            .where({ _id: guildData._id })
            .updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData);
      } else {
        guildData = new guildsData(param);
        await guildData.save();
        guildData.save = async function () {
          this.guildsData = guildsData;
          await this.guildsData
            .where({ _id: guildData._id })
            .updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData.toJSON());
      }
    });
  }
  async findOrCreateMember(param, isLean) {
    let membersData = this.membersData;
    let guildsData = this.guildsData;
    return new Promise(async function (resolve, reject) {
      let memberData = isLean
        ? await membersData.findOne(param).lean()
        : await membersData.findOne(param);
      if (memberData) {
        memberData.save = async function () {
          await membersData
            .where({ _id: memberData._id })
            .updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        resolve(memberData);
      } else {
        memberData = new membersData(param);
        await memberData.save();
        memberData.save = async function () {
          await membersData
            .where({ _id: memberData._id })
            .updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        let guild = await guildsData.findOne({ id: param.guildID });
        if (guild) {
          guild.members.push(memberData._id);
          await guild.save();
        }
        resolve(isLean ? memberData.toJSON() : memberData);
      }
    });
  }
};
