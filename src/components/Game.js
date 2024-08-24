import React, { useEffect, useRef, useState } from "react";
import Board from "./Board";

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [isVsComputer, setIsVsComputer] = useState(true); // jugar contra la máquina
  const [gameCode, setGameCode] = useState("");// Para compartir el código de acceso
  const ws = useRef(null); // Usamos useRef para mantener la conexión WebSocket

  useEffect(() =>{
    ws.current= new WebSocket('ws://localhost:8080');// Conectar al servidor WebSocket
    ws.current.onopen = () =>{
      console.log('Connected to WebSocket server');  
    }

    ws.current.onmessage = (event) =>{
      const message = JSON.parse(event.data);

      if(message.type === "updateBoard"){
        setBoard(message.board);
        setCurrentPlayer(message.currentPlayer);
      }

      if(message.type === "winner"){
        setWinner(message.winner);
      }
    }

    return () => {
      ws.current.close();// cerrar la conexión
    }

  }, []);

  const handleClick = (index) =>{
    if(board[index] || winner) return;
    // verifica si el tablero en la posición index ya está ocupado, si ya
    //hay un movimiento no deberia permitir otro o si existe un ganador tampoco
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const newWinnner = checkWinner(newBoard);
    if(newWinnner){
      setWinner(newWinnner)
      ws.current.send(JSON.stringify({
        type: "winner", 
        winner: newWinnner
      }));
    } else {
      const nextPlayer =currentPlayer==='X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      ws.current.send(JSON.stringify({
        type: "updateBoard",
        board: newBoard,
        currentPlayer: nextPlayer
      }))
    }   
  }

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], // Línea horizontal superior
      [3, 4, 5], // Línea horizontal media
      [6, 7, 8], // Línea horizontal inferior
      [0, 3, 6], // Línea vertical izquierda 
      [1, 4, 7], // Línea vertical central
      [2, 5, 8], // Línea vertical derecha
      [0, 4, 8], // Línea diagonal principal
      [2, 4, 6], // Línea diagonal secundaria
  ];

    for(let line of lines){
      const [a,b,c] = line;
      if(board[a] && board[a]===board[b] && board[a]===board[c]){
        return board[a];
      }
    }
    return null;
  }

  const resetGame = () =>{
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  }

  const makeComputerMove = (newBoard) => {
    let availableMoves= [];
    for(let i=0; i<newBoard.length;i++){
      if(newBoard[i]=== null){
        availableMoves.push(i);
      }
    }

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    newBoard[randomMove] = 'O';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if(gameWinner){
      setWinner(gameWinner);
    } else{
      setCurrentPlayer('X');
    }
  }

  useEffect(()=>{
    if(isVsComputer && currentPlayer === 'O' && !winner){
      setTimeout(() =>{
        makeComputerMove([...board]);
      }, 500)// Pequeño retraso para que parezca que la máquina "piensa"
    }
  }, [currentPlayer,board, isVsComputer,winner]);

  return(
    <div className="game">
      <Board squares={board} onClick={handleClick}/>
      {winner ? <p>{winner} wins!</p> : <p>Next player: {currentPlayer}</p>}
      <button onClick={resetGame}>Reset</button>
      <button onClick={() => setIsVsComputer(!isVsComputer)}>
        {isVsComputer ? "Play against another player" : "Play against the computer"}
      </button>
    </div>
  )
}

export default Game;