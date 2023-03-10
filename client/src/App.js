import logo from './logo.svg';
import './App.css';
import OpenGames from './OpenGames';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Game from './Game'
import MoveContextProvider from './MoveContext';
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

function App() {

  // Variables definition
  let openGames = [];
  const [board, setBoard] = useState(openGames);
  const room = {value:'---', setValue: function(r){this.value = r}}
  const [room2, setRoom2] = useState('')
 
  // Socket communication
  socket.on('initBoard', (juegosAbiertos)=>{
    if(juegosAbiertos.size === 0){
      juegosAbiertos = []
    }
    setBoard(juegosAbiertos)
  })

  function newGame(){
    room.setValue(socket.id)
    room2.setRoom2(socket.id)
    console.log(`(line 29 App.js debug) room.value: ${room.value} room2: ${room2}`)
    socket.emit('createdRoom', room.value)
  }
  socket.on('updateGameBoard', (updated) =>{
    openGames = updated
    setBoard(updated);
  })
  
  const joinGame = (creator) =>{
    room.setValue(creator)
    room2.setRoom2(creator)
    console.log(`(line 39 App.js debug) room.value: ${room.value} room2: ${room2}`)
    socket.emit('joinRoom', creator, socket.id)
  }

  const exitGame = () =>{
    if(socket.id === room.value){
      socket.emit('exitRoom', room.value)
    }
  }
  // TicTacToe Methods
  let [currentSquares, setcurrentSquares] = useState([null, null, null, null, null, null, null, null, null])
  let [status, setStatus] = useState('Click to start playing NOW')
  
  const clickedSquare = (i) => {
    let id = socket.id
    let roomo = room.value
    console.log(`(line 55 App.js debug) CLICKEDSQUARE - i: ${i}, id: ${id}, room.value: ${room.value}, room2: ${room2}`)
    socket.emit('clickedSquare', i, id,roomo)
  }
  socket.on('data',(currentSquaresZ)=>{
    console.log(`(line 59 App.js debug) 'data' currentSquaresZ: ${currentSquaresZ}`)
    setcurrentSquares(currentSquaresZ)
  })
  
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<OpenGames games={board} joinGame={joinGame}/>} />
              <Route path="/Game" element={
                <MoveContextProvider value={{clickedSquare, currentSquares, status}}>
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
