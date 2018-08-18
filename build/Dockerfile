from node:latest

workdir /app
copy ./* /app/
run npm install
entrypoint pm2 start index.js
