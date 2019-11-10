exports.run = async (bot, msg, args) => {
    var exec = require('child_process').exec, git, refresh;
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    if(!args[0]){
        msg.channel.send(":x: **Falta:** branch (rama)");
        return;
    }
    //
    msg.channel.send(" :red_circle: *Obteniendo cambios...*");
    async function git() {
    exec("git pull "+branch, (err, stdout, stderr) => {
      if (err) {
         msg.channel.send(":x: **Error:** "+ error);
         return;
      } else {
        if(stdout === "Already up-to-date."){
            msg.channel.send(":white_check_mark: **No hay cambios pendientes.** Todo está en orden.\n`"+stderr+"`");
            return;
        }
      }
    });
    exec("refresh", (err, stdout, stderr) => {
      if (err) {
        msg.channel.send(":x: **Error:** No se pudieron aplicar los cambios. **(STAGE: refresh --> Glitch)** "+ error);
        msg.channel.send("**Intervención manual requerida**");         
        return;
      } else {
       msg.channel.send(":white_check_mark: **Los cambios fueron aplicados satisfactoriamente.**")
      }
    });
    } 
    git();
}