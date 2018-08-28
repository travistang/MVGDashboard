from node:latest

workdir /app
add . /app
run npm install -g pm2
run npm install
run npm run build
entrypoint pm2 serve build/ 3000 --no-daemon
