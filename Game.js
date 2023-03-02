const useState = require('./useState.js')

function Game(i, currentSquares, currentMove){
  let gameOver=false
  function xIsNext(value){
    return value % 2 === 0;
  }

/*     if (calculateWinner(currentSquares) || currentSquares[i]) {
    console.log('Somebody won', i, currentSquares[i])
    return
  } */

  const nextSquares = currentSquares.slice();
  if (xIsNext(currentMove)) {
    nextSquares[i] = 'X';
  } else {
    nextSquares[i] = 'O';
  }

  currentMove++;
              
  const winner = calculateWinner(currentSquares);
  if (winner) {
    statuso = 'Winner: ' + winner;
    gameOver = true;
    return [nextSquares, currentMove, statuso, gameOver]
  } else if(currentMove===9){
    statuso = 'Stalemate';
  }else{
    statuso = 'Next player: ' + (xIsNext(currentMove) ? 'X' : 'O');
  }
  
  function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
              ];
  for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    gameOver=true
    return squares[a];
  }
  }
  return null;
  }

return [nextSquares, currentMove, statuso, gameOver, xIsNext(currentMove)]
}

  module.exports = Game
  