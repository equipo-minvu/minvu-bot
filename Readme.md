
#instalacion-local
git clone repositorio
cd minvu-bot
npm i / npm i -f
npm run dev
ejecutar botframework-emulator
http://localhost:3000/api/messages

#instalacion docker
#creamos la imagen segun la configuracion del Dockerfile
docker build -t img-bot-01 .

#ejecutamos la imagen
docker run --name bot-v.1 -d -p 3000:3000 img-bot-01
docker run --name bash-v.1 -it img-bot-01 /bin/bash


