import React, { useState } from "react";
import Board from "./Board";

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');

  const handleClick = (index) =>{
    if(!board[index]){
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer==='X' ? 'O' : 'X');
    }
  }

  const resetGame = () =>{
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
  }

  return(
    <div className="game">
      <Board squares={board} onClick={handleClick}/>
      <button onClick={resetGame}>Reset</button>
    </div>
  )
}

export default Game;