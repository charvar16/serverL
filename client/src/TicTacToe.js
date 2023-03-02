import React, { useState } from 'react';
import { useContext } from 'react';
import {MoveContext} from './MoveContext';

import { io } from "socket.io-client";
const socket = io('http://localhost:3000');

const clickable = true

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board(/* { squares, status } */) {
  const {clickedSquare, currentSquares, status} = useContext(MoveContext);
  function handleClick(i) {
    clickedSquare(i)
  }
  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={currentSquares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={currentSquares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={currentSquares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={currentSquares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={currentSquares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={currentSquares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={currentSquares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={currentSquares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
/*   let [currentSquares, setcurrentSquares] = useState([null, null, null, null, null, null, null, null, null])
  let [status, setStatus] = useState('Click to start playing') */

  return (
    <div className="game">
      <div className="game-board">
        <Board /* squares={currentSquares} status={status} */ />
      </div>
      <div className="game-info">
      </div>
    </div>
  );
}
