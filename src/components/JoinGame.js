import React, { useEffect, useState } from 'react';

const JoinGame = ({ webSocket, onJoinGame }) => {
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ws, setWs] = useState(webSocket);

  const handleJoinGame = (code) => {    
    console.log(webSocket);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Connected to WebSocket server');
      webSocket.send(JSON.stringify({ type: 'join', code }));

      webSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'gameFull') {
          setErrorMessage(message.message);
        } else {
          console.log('joingame');
          onJoinGame(code); // Llama a onJoinGame si todo está bien
        }
      };
    } else {
      console.error('WebSocket is not connected or not open');
      setErrorMessage('WebSocket connection is not open.');
    }

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorMessage('Connection error, please try again.');
    };
  };

  return (
    <div className='join-game'>
      <h2>Join a Game</h2>
      <input
        type='text'
        placeholder='Enter game code'
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
      />
      <button onClick={() => handleJoinGame(gameCode)}>Join Game</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default JoinGame;
