import React, { useEffect, useState } from 'react';
import CreateGame from './components/CreateGame';
import { generateGameCode } from './components/Code';
import JoinGame from './components/JoinGame';
import Game from './components/Game';

const App = () => {
  const [menuOption, setMenuOption] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [isVsComputer, setIsVsComputer] = useState(true);
  const [webSocket, setWebSocket]= useState(null);

  useEffect(()=>{
    console.log(webSocket);   
  },[webSocket]) 
  
  const handleStartGame = (code, isComputer, ws) => {
    setGameCode(code);
    setIsVsComputer(isComputer);   
    
    if(ws){ 
      setWebSocket(ws);
      console.log(webSocket);
    }
    setMenuOption("play");
  };
     
  const handleJoinGame = (code) => {
    console.log("Joining game with code:", code);
    setGameCode(code);
    setIsVsComputer(false);
    setMenuOption("play")
  };

  return (
    <div className="App">
      {!menuOption ? (
        <div>
          <h1>Menú Principal</h1>
          <button onClick={() => setMenuOption("create")}>Crear Juego</button>
          <button onClick={() => setMenuOption("join")}>Unirse a un Juego</button>
        </div>
      ) : menuOption === "create" ? (
        <CreateGame code={generateGameCode()} onStartGame={handleStartGame} />     
      ) : menuOption === "join" ? (
        <JoinGame webSocket={webSocket} onJoinGame={handleJoinGame} />
      ) : (
        <Game code={gameCode} isVsComputer={isVsComputer} />
      )}
    </div>
  );
};

export default App;
