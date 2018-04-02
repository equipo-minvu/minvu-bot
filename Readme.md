
# Instalacion-local
```
git clone repositorio
cd minvu-bot
npm i / npm i -f
npm run dev
ejecutar botframework-emulator
http://localhost:3000/api/messages
```

# Instalacion-docker
```
Creamos el archivo Dockerfile en la ruta de nuestro proyecto (bot/minvu-bot)
```

# Demo-docker
```
1.- Identificamos la ruta de nuestro proyecto (pwd)
2.- Listamos lo que existe en la ruta de nuestro proyecto (ls)
3.- Verificamos que tiene nuestro archivo Dokerfile (cat Dockerfile)
```
![001](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/01.png)

```
4.- Listamos las imagenes que actualmente tenemos (docker images)
5.- Creamos una nueva imagen (docker build -t img-bot-01 .)
6.- Verificamos que la nueva imagen sea creada (docker images / img-bot-01)
```
![002](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/02.png)
![003](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/03.png)

```
7.- Creamos el contenedor en base a nuestra imagen creada 
(docker run --name bot-v.1 -d -p 3000:3000 img-bot-01)
```
![004](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/04.png)

```
8.- Verificamos que responda en el puerto 3000 (localhost:3000)
```
![005](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/05.png)
```
09.- Listamos los contenedores (docker container ls -a)
10.- Creamos un segundo contenedor en base a nuestra imagen 
(docker run --name bash-v.1 -it img-bot-01 bash), esto nos permite entrar al contenedor
en modo consola/terminal/bash (bash 4.3#)(pwd/ls/ls -a/exit)
11.- Listamos los contenedores (docker container ls -a) donde esta vez tenemos
dos instancias de nuestra imagen o dos container ejecutandose.
```
![006](https://github.com/yogparra/minvu-bot/blob/docker/img-docker/09.png)

