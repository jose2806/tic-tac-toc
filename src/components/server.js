const webSocket = require('ws');
const PORT = process.env.PORT || 8000;
const wss = new webSocket.Server({ port: PORT });

const games = {}; // Almacena el estado del juego para cada código de juego

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);

    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message); // Parsear el mensaje JSON
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
    }
      
    const { type, code, board, currentPlayer, winner } = parsedMessage;
   
    switch (type) {
      case 'join':
        if (!games[code]) {
          games[code] = {
            clients: [],
            board: Array(9).fill(null),
            currentPlayer: 'X',
            winner: null,
          };
        }

        if (games[code].clients.length >= 2) {
          // Si ya hay dos jugadores, rechazamos al nuevo cliente
          ws.send(JSON.stringify({
            type: 'gameFull',
            message: 'The game is already full.',
          }));
          return
        }        

        console.log(games[code]);
        games[code].clients.push(ws);

        if(games[code].clients.length === 2){
          const creator = games[code].clients[0];
          if(creator.readyState === ws.OPEN){
            creator.send(JSON.stringify({
              type:'playerJoined',
              message:'A new player has joined your game!',
            }))
          }
        }   
      break;

      case 'updateBoard':
        console.log(`Updating board for game code: ${code}`);
        if (games[code]) {
          games[code].board = board;
          games[code].currentPlayer = currentPlayer;
          games[code].clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'updateBoard',
                  board,
                  currentPlayer,
                })
              );
            }
          });
        } else {
          console.error(`Game code ${code} not found`);
        }     
        break;

      case 'winner':
        if (games[code]) {
          games[code].winner = winner;
          games[code].clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ 
                type: 'winner', winner 
              }));
            }
          });
        }
        break;

      default:
        console.log('Unknown message type:', type);
    }
  });

  ws.on('close', (event) => {
    console.log('Client disconnected',event);
    // Eliminar al cliente de todos los juegos
    Object.keys(games).forEach(code => {
      games[code].clients = games[code].clients.filter(client => client !== ws);
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

});
console.log(`Server is running on ws://localhost:${PORT}`);
