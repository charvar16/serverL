const express = require('express')
const app = express()
const port = 3000
const path = require("path");
//const { client, db } = require('./mongoConn');

const { createServer } = require("http");
const httpServer = createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, { /* options */ });

const Game = require('./Game.js')
const openGames = []

// Define Variables and Functions
const rooms = new Map()
function GameState(creator) {
    this.creator = creator
    this.opp = 'Waiting...'
    this.currentSquares = [null,null,null,null,'X',null,null,null,null];
    this.currentMove = 0
    this.statuso = '';
    this.gameOver = false;
    this.xIsNext = true;
    this.turn = this.creator;
    this.values = function(){return [this.creator, this.opp, this.currentSquares, this.currentMove, this.statuso, this.gameOver, this.xIsNext]}
}

app.use(express.static(path.join(__dirname, "client", "build")))

async function main() {
  //await client.connect().then(console.log("Atlas Mongo connection succesful"));
  io.on('connection', socket => {
    // Return Opened Rooms
    function openedRoomsF(){
      let openedRoomsResult = []
      for (const k of rooms.keys()) {
          let obj = {creator:rooms.get(k).creator, opponent:rooms.get(k).opp}
          openedRoomsResult.push(obj);
      }
      return openedRoomsResult
    }
    // Create New Room
    function createRoom(id){
        let state = new GameState(id)
        rooms.set(id,state)
    }
    // Get Room (function utility)
    function getRoom(id){
        return rooms.get(id)
    }
    // Opponent Joins Room
    function joinRoom(creator, id){
        socket.join(creator)
        let room = getRoom(creator)
        if(room.opp==='Waiting...'){
          room.opp = id
          
        }
        let openedRooms = openedRoomsF()
        let currentSquaresV = currentSquares(creator)
          console.log(`(line 62 server.js debug) currentSquaresV(array): ${currentSquaresV}`)
        io.emit('updateGameBoard',openedRooms)
    }
    // Get currentSquares
    function currentSquares(room){
        console.log(`(line 67 server.js debug) currentSquaresV.room(string): ${room}`)
      let squares = getRoom(room).currentSquares
        console.log(`(line 69 server.js debug) squares.currentSquares(array): ${squares}`)
      return squares
    }
    // Get currentMove
    function currentMove(room){
      let move = getRoom(room)
      return move.currentMove
    }
    // Get gameOver
    function gameOver(room){
      let go = getRoom(room)
      return go.gameOver
    }
    // Return Room Values
    function roomValues(id){
        let room = getRoom(id)
        return room.values()
    }
    // Exit Room
    function deleteRoom(id){
        rooms.delete(id)
        io.emit('updateGameBoard',openedRoomsF())
    }
    // xIsNext
    function xIsNext(id){
      let room = getRoom(id)
      return rooms.xIsNext
    }
    // Make New Move | Update Game State
    function newMove(id, i){
      let [nextSquares, currentMove, statuso, gameOver, xIsNext] = Game(i, currentSquares(id), rooms.get(id).currentMove/*currentMove(id)*/)
      let room = getRoom(id)
      room.currentSquares = nextSquares
      room.currentMove = currentMove
      room.statuso = statuso
      room.gameOver = gameOver
      room.xIsNext = xIsNext
      if(xIsNext){
        getRoom(id).turn = room.creator
        console.log(getRoom(id))
      }else{
        getRoom(id).turn = room.opp
        console.log(getRoom(id))
      }
    }





    app.get('/', (req, res) => {
      
      res.status(201).sendFile(path.join(__dirname, "client", "build"))
    })
    
    socket.emit('initBoard', openedRoomsF()/*openGames*/)
    
    socket.on('createdRoom', (room) =>{
      createRoom(room)
      io.emit('updateGameBoard',openedRoomsF()/*openGames*/)
    })
                      
    socket.on('joinRoom', (room, id) =>{
      joinRoom(room, id)
    })                  
    socket.on('clickedSquare',(i, id, room)=>{
      console.log(`(line 135 server.js debug) i: ${i}, id: ${id}, room: ${room}`)
      let gameOver=getRoom(room)
      let turn=getRoom(room)
      console.log('                            ')
      console.log(`line 139 server.js debug) getRoom(id): ${getRoom(room)}`)
      if(!gameOver && id===turn){
        newMove(room, i)                        
        io.emit('data',currentSquares(id),gameOver(id))
        }
      })
    

    socket.on('exitRoom', (creatorId) =>{
      deleteRoom(creatorId)
    })






    
    
  });
  httpServer.listen(port);
  //await clicks.insertOne(newClick).then(()=>console.log("Added new document to Mongo database"))
}

main()
  .then(console.log("Main promise fullfiled"))
  .catch(console.error)
//  .finally(() => client.close());