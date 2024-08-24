const webSocket = require('ws');

const wss = new webSocket.WebSocketServer({port:8000});
wss.on('connection', (ws) => {
  ws.on('message',(message) =>{
    wss.clients.forEach((client) =>{
      if(client.readyState === webSocket.OPEN){
        client.send(message);
      }
    })
  })
})
console.log('Server is running on ws://localhost:8080');
