from hypriot/rpi-node

workdir /app
copy ./index.js ./package.json ./package-lock.json /app/
run npm install
entrypoint node index.js
