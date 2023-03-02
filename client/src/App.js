import logo from './logo.svg';
import './App.css';
import OpenGames from './OpenGames';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Game from './Game'
import MoveContextProvider from './MoveContext';
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');
let roomId

function App() {
  // Variables definition
  let openGames = [];
  let roomPlayers = { creator: socket.id, opponent: 'WAITING' };
  const [board, setBoard] = useState(openGames);
  const room = {value:'', setValue: function(r){this.value = r}}
  let coom = 'd'
 
  // Socket communication
  socket.on('initBoard', (juegosAbiertos)=>{
    if(juegosAbiertos.size === 0){
      juegosAbiertos = []
    }
    setBoard(juegosAbiertos)
  })

  function newGame(){
    room.setValue(socket.id)
    coom = socket.id
    console.log(`(line 30 App.js debug) room.value: ${room.value}   , coom: ${coom}`)
    socket.emit('createdRoom', room.value/*roomPlayers*/) //roomId
  }
  socket.on('updateGameBoard', (updated) =>{
    //console.log(`(line 35 App.js debug) 'updatedGameBoard' openedRooms: ${updated}`)
    openGames = updated
    //console.log('openGamesData '+JSON.stringify(openGames))
    setBoard(updated);
  })
  
  const joinGame = (creator) =>{
    room.setValue(creator)
    coom = creator
    console.log(`(line 42 App.js debug) room.value: ${room.value}    , coom: ${coom}`)
    socket.emit('joinRoom', creator, socket.id)
    //console.log(`(line 45 App.js debug) room: ${creatore}`)
  }

  const exitGame = () =>{
    if(socket.id === room.value){//roomId
      socket.emit('exitRoom', room.value)
    }
  }
  // TicTacToe Methods
  let [currentSquares, setcurrentSquares] = useState([null, null, null, null, null, null, null, null, null])
  let [status, setStatus] = useState('Click to start playing NOW')
  
  const clickedSquare = (i) => {
    let id = socket.id
    let roomo = room.value
    console.log(`(line 59 App.js debug) CLICKEDSQUARE - i: ${i}, id: ${id}, room.value: ${room.value}     coom: ${coom}`)
    socket.emit('clickedSquare', i, id,roomo)
  }
  socket.on('data',(currentSquaresZ/*,gameOverZ*/)=>{
    console.log(`(line 63 App.js debug) 'data' currentSquaresZ: ${currentSquaresZ}`)
    setcurrentSquares(currentSquaresZ)
    //setStatus()
  })

  socket.on('opponentMove', (opMov) =>{
    //update the variable allowing movement on TicTacToe.js
  })
  //openGamesData.openGames.findIndex(obj => obj.creator === room)
  
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<OpenGames games={board} joinGame={joinGame}/>} />
              <Route path="/Game" element={
                <MoveContextProvider value={{clickedSquare, /* updatedValues, */ currentSquares, status}}>
                  <Game exitGame={exitGame}/>
                </MoveContextProvider>                
              } />

          </Routes>
          <NavLink to='/Game' onClick={newGame} style={({ isActive }) => 
            ({visibility: isActive ? 'hidden' : 'visible' })}>Create a New Game</NavLink>
          <NavLink to='/' onClick={exitGame} style={({ isActive }) => 
            ({visibility: isActive ? 'hidden' : 'visible' })}>Exit Game</NavLink>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
