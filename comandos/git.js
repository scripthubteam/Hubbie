exports.run = async (bot, msg, args) => {
    var exec = require('child_process').exec, git, refresh;
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    if(!args[0]){
        msg.channel.send(":x: **Falta:** branch (rama)");
        return;
    }
    msg.channel.send(" :red_circle: *Obteniendo cambios...*")
    git = exec('git pull origin '+args,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
             msg.channel.send("**Github:** "+ error);
             return;
        }
    });
    git();
    refresh = exec('refresh',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
             msg.channel.send(":x: **Error:** No se pudieron aplicar los cambios. **(STAGE: refresh --> Glitch)** "+ error);
             msg.channel.send("**Intervención manual requerida**");
             return;
        }
    });
    msg.channel.send(":white_check_mark: **Los cambios fueron aplicados satisfactoriamente.**")
    refresh();
    
}