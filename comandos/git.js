exports.run = async (bot, msg, args) => {
    var exec = require('child_process').exec, git, refresh;
    if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send(":x: No posees los permisos necesarios.")
    if(!args[0]){
        message.channel.send(":x: **Falta:** branch (rama)");
    }
    git = exec('git pull origin '+args,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
             message.channel.send(":x: **Error:** No se pudo contactar a la rama. "+ error);
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
             message.channel.send(":x: **Error:** No se pudo refrescar los cambios. "+ error);
             return;
        }
    });
    refresh();
    
}