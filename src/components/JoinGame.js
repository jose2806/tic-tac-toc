import React, { useState } from 'react';

const JoinGame= ({onJoinGame}) =>{
  const [gameCode,setGameCode]= useState("");

  const handleJoinGame = () =>{
    if(gameCode.trim()){
      onJoinGame(gameCode);
    }
  }

  return (
    <div className="join-game">
      <h2>Join a Game</h2>
      <input type="text" placeholder="Enter game code" value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}/>
      <button onClick={handleJoinGame}>Join Game</button>
    </div>
  )
}

export default JoinGame;