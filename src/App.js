import React, { useState } from 'react';
import CreateGame from './components/CreateGame';
import { generateGameCode } from './components/Code';
import JoinGame from './components/JoinGame';
import Game from './components/Game';

const App = () => {
  const [menuOption, setMenuOption] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [isCreator, setIsCreator] = useState(false);  //Indica si el usuario es el creador del juego. 

  const handleCreateGame = () => {
    const code = generateGameCode();
    setGameCode(code);
    setIsCreator(true);
    setMenuOption("create");
  };

  const handleJoinGame = (code) => {
    setMenuOption("join");
  };

  const startGame = (code) => {
    setGameCode(code);
    setMenuOption("play");
  };

  return (
    <div className="App">
      {!menuOption ? (
        <div>
          <h1>Menú Principal</h1>
          <button onClick={handleCreateGame}>Crear Juego</button>
          <button onClick={handleJoinGame}>Unirse a un Juego</button>
        </div>
      ) : menuOption === "create" ? (
        <CreateGame code = {gameCode} onStartGame={startGame}/>
      ) : menuOption === "play" ? (
        <Game gameCode={gameCode} isCreator={isCreator} />
      ):
      (
        <JoinGame />
      )}
    </div>
  );
};

export default App;
