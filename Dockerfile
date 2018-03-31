# imagen a montar, forzando la vercion 8.11
FROM mhart/alpine-node:8.11

# detalles y descripciones
LABEL   bot.version="1.0.0" \ 
        bot.description="Instancia de minvu-bot para docker." \
        bot.name="minvu-bot"

# crea en el contenedor el directorio minvu-bot y lo asigna como 
#directorio de trabajo
RUN mkdir -p /usr/src/minvu-bot
WORKDIR /usr/src/minvu-bot

# instala dependencia extras 
RUN apk add --no-cache make gcc g++ python bash

# copianos nuestro codigo a la ruta del container
# instala las dependencia solo de produccion "dependencies"
COPY . /usr/src/minvu-bot
RUN npm install --production

# exponemos el puerto 3000
EXPOSE 3000

# ejecutamos dentro del contenedor
CMD [ "npm", "start" ]