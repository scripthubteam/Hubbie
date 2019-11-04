exports.run = async (bot, msg, args) => {

    let argsData = args.join(" ")
    let parts = argsData.split("|"),
        type = parts[0],
        user = parts[1],
        title = parts[2],
        desc = parts[3],
        url = parts[4],
        imgch = parts[5];
        let colortypecontent;
        let partnerchannel = bot.channels.get("632978714967146517")
        // Hex-list 
        const colortype = {
            "twitch": "6570405",
            "youtube": "12857387",
            "discord": "7506394"
        }
        // Tipo de patrocinio
        if(!type){
            message.channel.send(":x: **Especifica un tipo de patrocinio.**");
            return;
        }
        // Título
        if(!title){ 
            message.channel.send(":x: **Especifica el título**");
            return;
        }
        // Descripción
        if(!desc){
            message.channel.send(":x: **Especifica la descripción**");
            return;
        }
        // URL
        if(!url){
            message.channel.send(":x: **Especifica una URL**");
            return;
        }

        if(!imgch){
            message.channel.send(":x: **Especifica una imagen.**");
            return;
        }
        let userconvert = bot.users.get(user)
        if(!userconvert){
            message.channel.send(":x: **El ID del usuario introducido no existe**")
            return;
        }

        // Twitch
        if(type === "twitch"){
            colortypecontent = colortype.twitch;
            let embedTW = {
                "embed": {
                    "title": title,
                    "description": desc,
                    "url": url,
                    "color": colortypecontent,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/emojis/632377244232318986.png?v=1",
                        "text": "Partner verificado"
                    },
                    "thumbnail": {
                        "url": imgch
                    }
                }
            };
            partnerchannel.send(":small_orange_diamond: **Patrocinado por:** <@"+userconvert.id+">\n"+url);
            partnerchannel.send(embedTW)
            return;
        }

        // YT

        if(type === "youtube"){
            colortypecontent = colortype.youtube;
            let embedYT = {
                "embed": {
                    "title": title,
                    "description": desc,
                    "url": url,
                    "color": colortypecontent,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/emojis/632377244232318986.png?v=1",
                        "text": "Partner verificado"
                    },
                    "thumbnail": {
                        "url": imgch
                    }
                }
          };
            partnerchannel.send(":small_orange_diamond: **Patrocinado por:** <@"+userconvert.id+">\n"+url);
            partnerchannel.send(embedYT)
            return;
        }

        // Discord

        if(type === "discord"){
            colortypecontent = colortype.discord;

            let embedD = {
                "embed": {
                    "title": title,
                    "description": desc,
                    "url": url,
                    "color": colortypecontent,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/emojis/632377244232318986.png?v=1",
                        "text": "Partner verificado"
                    },
                    "thumbnail": {
                        "url": imgch
                    }
                }
            };
            partnerchannel.send(":small_orange_diamond: **Patrocinado por:** <@"+userconvert.id+">\n"+url);
            partnerchannel.send(embedD);
            return;
        }
          

        if(type){
            message.channel.send(":x: **Categoría inexistente.**")
        }
        return;

}