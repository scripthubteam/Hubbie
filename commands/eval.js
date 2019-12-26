const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args) => {
  const arr = {
    arr: [
      "595734746059898927",
      "280985817097306113",
      "506199865722798092",
      "608817245417898004"
    ]
  };
  if (arr.arr.indexOf(msg.author.id) != -1) {
    const clean = text => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203))
          .substr(0, 1014);
      else {
        return text;
      }
    };
    try {
      const code = args.join(" ");
      let evaled = eval(code);
      if (typeof evaled !== "string");
      evaled = require("util").inspect(evaled);
      console.log(clean(evaled));
      const embed = new RichEmbed()
        .setColor(0xf4427a)
        .setFooter("Eval")
        .addField("INPUT", `\`\`\`js\n${code}\n\`\`\``)
        .addField("OUTPUT", `\`\`\`js\n${clean(evaled)}\n\`\`\``);
      msg.channel.send(embed);
    } catch (err) {
      msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      console.error(err);
    }
  }
};

exports.aliases = ["e", "chk"];
exports.public = false;
exports.description = "Evalúa código.";
exports.usage = "s!eval código";
