from hypriot/rpi-node:latest

workdir /app
add . /app
run npm install -g http-server
run npm install
run npm run build
cmd http-server -p 3000
