# Script Hub Free
**Script Hub Free** es el repositorio de GitHub que contiene el código fuente del bot de la comunidad de [**Script Hub**](https://scripthubteam.github.io/ "Script Hub"). Este bot es el que está al mando del club de bots, ayuda a la moderación en la comunidad y también ayuda a darse a conocer por medio de compartimientos de proyectos o patrocinios.


### Requisitos, configuración e instalación
Se necesita tener instalado [**NodeJS v8.x** o superior](https://nodejs.org/en/download/ "NodeJS descargas") y este mismo también descarga un programa llamado **NPM**, el cual administra todas las librerías de **Node**.

Para instalar las librerías necesarias para el uso de **Script Hub Free** simplemente se ejecuta el comando `npm install` en la consola de nuestro sistema operativo.

Se necesitarán dos archivos de configuración y claves de acceso, uno de ellos es el más fundamental y se denomina `.env`, una base de este es:
```env
scriptHubToken=DiscordBotToken
mDbUri=BaseDeDatosMongoDBURI
```
El otro archivo de configuración, el cual será llamado `channelsConfig.json`, indicarán los canales de cada cosa, un ejemplo de este es:
```json
{
  "inviteChannelId": "Canal para invitar",
  "globalChannelId": "Canal general o global",
  "projectsChannelId": "Canal de proyectos",
  "partnersChannelId": "Canal de patrocinios",
  "playgroundChannelId": "Canal del club de bots",
  "privateLogsChannelId": "Canal de registros privados",
  "botRequestsChannelId": "Canal de peticiones de bots"
}
```

Una vez configurado totalmente el bot, podremos ejecutarlo usando el siguiente comando `npm start` (o `node index.js`) en la consola.

### Desarrolladores
- [Deivid](https://github.com/Drylotrans "Drylotrans")
- [mon](https://github.com/wwmon "mon")
- [ToelF](https://github.com/toelf412 "toelf412")
- [Devsaider](https://github.com/MrDevsaider "MrDevsaider")
- [Lau](https://github.com/Laauuu "Lau")
- [tati1206](https://github.com/tati1206 "tati1206")