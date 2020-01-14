# Script Hub Free

**Script Hub Free** es el repositorio de GitHub que contiene el código fuente del bot de la comunidad de [**Script Hub**](https://scripthubteam.github.io/ 'Script Hub'). Este bot es el que está al mando del club de bots, ayuda a la moderación en la comunidad y también ayuda a darse a conocer por medio de compartimientos de proyectos o patrocinios.

## Instalación

Instala los paquetes de dependencias necesarios:

`npm i`

## Configuración

Plantilla `.env`:

```env
# Importante
 # Tokens
  # Bot
   tokBot=''
  # MongoDB
   tokMongodb=''
 # Bot
  # Prefijo
   botPrefix=''

# ID's
 # Owners
  # Username#1010
   ownUsername=''
 # Servidor
  servID=''
  # Categorías
   # Información
    catInfo=''
    # Canales
     # Introducción
      chanIntro=''
     # Reglas
      chanRules=''
     # Casos
      chanCases=''
   # Comunidad
    catCom=''
    # Canales
     # Global
      chanGlobal=''
     # Sugerencias
      chanSuggs=''
     # Proyectos
      chanProjects=''
   # Staff
    catStaff=''
    # Canales
     # Requests
      chanRequest=''
     # Logs
      chanLogs=''
   # Lenguajes
    catLangs=''
   # Tickets
    catTickets=''
   # Bots
    catBots=''
    # Canales
     # Invitar
      chanInvite=''
     # Playground
      chanPlay=''
  # Roles
   # Staff
    # SH Team
     roleSHT=''
    # CEO
     roleCEO=''
    # Representantes
     roleRep=''
    # Dep. Comunidad
     roleDepCom=''
    # Dep. Técnico
     roleDepTec=''
   # Comunidad
    # Verificado(a)
     roleVeri=''
    # Usuario
     roleUser=''
   # Bots
    # General
     roleBotsGen=''
    # Club
     roleClub=''
    # Test
     roleTest=''
```

## Ejecución

¡Ejecuta!

`node index.js`

## ¿Como reportar issues?

Por favor, en caso de encontrar errores o bugs, sigue este formato

```e
Como reproducir el bug:
Resultado obtenido:
Resultado esperado:
Información extra:
```
