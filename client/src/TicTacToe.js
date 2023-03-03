import React, { useState } from 'react';
import { useContext } from 'react';
import {MoveContext} from './MoveContext';


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ clickedSquare, currentSquares, status} ) {
   
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={currentSquares[0]} onSquareClick={() => clickedSquare(0)} />
        <Square value={currentSquares[1]} onSquareClick={() => clickedSquare(1)} />
        <Square value={currentSquares[2]} onSquareClick={() => clickedSquare(2)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[3]} onSquareClick={() => clickedSquare(3)} />
        <Square value={currentSquares[4]} onSquareClick={() => clickedSquare(4)} />
        <Square value={currentSquares[5]} onSquareClick={() => clickedSquare(5)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[6]} onSquareClick={() => clickedSquare(6)} />
        <Square value={currentSquares[7]} onSquareClick={() => clickedSquare(7)} />
        <Square value={currentSquares[8]} onSquareClick={() => clickedSquare(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const {clickedSquare, currentSquares, status} = useContext(MoveContext);

  return (
    <div className="game">
      <div className="game-board">
        <Board clickedSquare={clickedSquare} currentSquares={currentSquares} status={status}/>
      </div>
      <div className="game-info">
      </div>
    </div>
  );
}
