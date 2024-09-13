import React, { useState } from "react";

const CreateGame = ({code,onStartGame }) =>{
  const [gameCode, setGameCode] = useState(code);
  const [isVsComputer, setIsVsComputer] = useState(true); // jugar contra la máquina
  const [copySuccess, setCopySuccess] = useState('');
  const [ws, setWs] = useState(null);
  const [isGameFull, setIsGameFull] = useState(false);
  
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopySuccess('Game code copied to clipboard!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const handleCreateGame = () =>{
    if(isVsComputer){
      onStartGame(gameCode,isVsComputer)
    } else {
      const webSocket = new WebSocket(`ws://localhost:${process.env.REACT_APP_WS_PORT || 8000}`);

      webSocket.onopen = () => {
        console.log('Connected to WebSocket server');
        webSocket.send(JSON.stringify({ type: 'join', code: gameCode }));
        // Pasa el WebSocket a onStartGame para que el componente Game lo utilice       
        onStartGame(gameCode, isVsComputer, webSocket);
      }
    
      webSocket.onmessage=(event) => {
        try{
          const message = JSON.parse(event.data);
          if(message.type === 'gameFull'){
            alert(message.message);
              setIsGameFull(true);
             // webSocket.close();
          } else if (message.type === 'playerJoined') {
            alert(message.message);
          }
        } catch(error){
          console.error('Error parsing message:', error.message);
        }
      }

      webSocket.onerror = (error) => {
      console.error('WebSocket error:', error.message || error);
      };

      webSocket.onclose = () => {
      console.log('WebSocket connection closed');
      };

      setWs(webSocket);
    }
  };

  return(
    <div>
      <h2>Create Game</h2>
      <label>
        <input 
          type="radio" 
          checked={isVsComputer} 
          onChange={() => setIsVsComputer(true)} 
        />
        Play against the computer
      </label>
      <label>
        <input 
          type="radio" 
          checked={!isVsComputer} 
          onChange={() => setIsVsComputer(false)} 
        />
        Play against another player
      </label>

      {!isVsComputer && (
        <>
          <h2>Your Game Code</h2>
          {copySuccess && <p>{copySuccess}</p>}
          <p>{gameCode}</p>
          <button onClick={() => copyToClipboard(gameCode)}>Copy Code</button>
        </>
      )}
      <button onClick={handleCreateGame}>Start Game</button>
    </div>
  )
}

export default CreateGame;