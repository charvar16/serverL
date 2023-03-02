const serverprueba = require("./serverprueba.js")

const useState = require('./useState.js')

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
    this.turn = creator;
    this.values = function(){return [this.creator, this.opp, this.currentSquares, this.currentMove, this.statuso, this.gameOver, this.xIsNext]}
}


/* const clicks = db.collection('Clicks');
  const newClick = {
    ip : "despues de cambiar el package json"
  } */  

app.use(express.static(path.join(__dirname, "client", "build")))

async function main() {
  //await client.connect().then(console.log("Atlas Mongo connection succesful"));
  //  app.get('/', (req, res)   was originally here
  io.on('connection', socket => {
    // Return Opened Rooms
    function openedRoomsF(){
      let openedRoomsResult = []
      for (const k of rooms.keys()) {
          let obj = {creator:rooms.get(k).creator, opponent:rooms.get(k).opp}
          openedRoomsResult.push(obj/*{creat, opp}*/);
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
    function joinRoom(creator, id/*, oppID*/){
        socket.join(creator)
        let room = getRoom(creator)
        if(room.opp==='Waiting...'){
          room.opp = id
          //console.log(`(line 69 server.js debug) creator: ${creator}, getRoom(creator).creator: ${getRoom(creator).creator} getRoom(creator).opp: ${getRoom(creator).opp}, room.opp: ${room.opp}`)
        }
        let openedRooms = openedRoomsF()
        let currentSquaresV = currentSquares(creator)
          console.log(`(line 72 server.js debug) currentSquaresV(array): ${currentSquaresV}`)
        io.emit('updateGameBoard',openedRooms)
        //io.emit('data',currentSquaresV)
    }
              // Update currentSquares SEEMS REDUNTANT
              function updateSquares(id,newSquares){
                  let roomToUpdate = getRoom(id)
                  roomToUpdate.currentSquares = newSquares
              }
    // Get currentSquares
    function currentSquares(room){
        console.log(`(line 83 server.js debug) currentSquaresV.room(string): ${room}`)
      let squares = getRoom(room).currentSquares
        console.log(`(line 85 server.js debug) squares.currentSquares(array): ${squares}`)
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
        //room.turn = room.creator
        getRoom(id).turn = room.creator
        console.log(getRoom(id))
      }else{
        //room.turn = room.opp
        getRoom(id).turn = room.opp
        console.log(getRoom(id))
      }
      //console.log('room.turn: ',room.turn,' getRoom(id).turn: ',getRoom(id).turn)
    }





    app.get('/', (req, res) => {
      
      res.status(201).sendFile(path.join(__dirname, "client", "build"))
    })
    
    socket.emit('initBoard', openedRoomsF()/*openGames*/)
    
    socket.on('createdRoom', (room) =>{
      createRoom(room)
                        //const history = useState([Array(9).fill(null)]);
      /* let currentMoveZ = 0;
      let currentSquaresZ=[null,null,null,null,null,null,null,null,null]//useState([Array(9).fill(null)]);
      let statusoZ;*/
      
      // Game(i, currentSquares, currentMove, statuso)
      io.emit('updateGameBoard',openedRoomsF()/*openGames*/)
    })
                      
    socket.on('joinRoom', (room, id) =>{
      joinRoom(room, id)
      /* let updateOpponent = openGames.findIndex(obj => obj.creator === room)
         openGames[updateOpponent].opponent = socket.id
         socket.join(room) */
         //io.emit('updateGameBoard',openedRoomsF())
    })                  
    socket.on('clickedSquare',(i, id, room)=>{
      console.log(`(line 83 server.js debug) i: ${i}, id: ${id}, room: ${room}`)
      let gameOver=getRoom(room)//.gameOver
      let turn=getRoom(room)
      //console.log('                      room: ', room,'gameOver:      ',gameOver,' turn: ',turn)
      console.log('                            ')
      console.log(`getRoom(id): ${getRoom(room)}`)
      if(!gameOver && id===turn){
        //console.log({gameOverZ}, '. shouldnt print after game over')
        newMove(room, i)
        //turn = !turn
        //console.log({turn})
        /* let [nextSquares, currentMove, statuso, gameOver] = Game(i, currentSquares(id), currentMove(id))
                        currentMoveZ=currentMove
                        currentSquaresZ=nextSquares
                        statusoZ=statuso
                        gameOverZ=gameOver */
                        
        io.emit('data',currentSquares(id)/*currentSquaresZ*/,gameOver(id)/*gameOverZ*/)
        }
      })
    
                      
    socket.on('playerMove', ()=>{
        console.log('SIIIIIIIIIIIIIIIIIIIP')
      })
      socket.on('pruebaDos',()=>{
        console.log('Prueba dos')
      })

    socket.on('exitRoom', (creatorId) =>{
      deleteRoom(creatorId)
      /*   console.log('in closeRoom')
      let roomIndex = openGames.findIndex(rooms => rooms.creator === creatorId)
      openGames.splice(roomIndex, 1) */
      
      //io.emit('updateGameBoard',openedRoomsF()/*openGames*/)
    })






    
    
  });
  httpServer.listen(port);
  //await clicks.insertOne(newClick).then(()=>console.log("Added new document to Mongo database"))
}

main()
  .then(console.log("Main promise fullfiled"))
  .catch(console.error)
//  .finally(() => client.close());