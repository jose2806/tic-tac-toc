import React, { useState } from "react";

const CreateGame = ({code,onStartGame }) =>{
  const [gameCode, setGameCode] = useState(code);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Game code copied to clipboard!");
  };

  const handleCreateGame = () =>{
    if (onStartGame) {
      onStartGame(gameCode);  
    }
  }

  return(
    <div>
      <h2>Your Game Code</h2>
      <p>{gameCode}</p>
      <button onClick={() => copyToClipboard(gameCode)}>Copy Code</button>
      <button onClick={handleCreateGame}>Start Game</button>
    </div>
  )
}

export default CreateGame;