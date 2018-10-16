from node:8

workdir /app
add package*.json index.js /app/
add models /app/models
run ls 
run npm install -g pm2
run npm install
expose 3001
cmd node index.js
#entrypoint pm2 start --no-daemon index.js
