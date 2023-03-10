import { Link } from "react-router-dom";
import TicTacToe from './TicTacToe'
import "./TicTacToe.css";

const GameTable = ({exitGame}) => 
{
return (
    <div>
        <h1>Welcome to your game</h1>
        <TicTacToe />
        <p>Players will arrive shortly</p>
        <Link to={`/`} onClick={()=>exitGame()}>Exit the game</Link>
    </div>
  )} 
  
  
export default GameTable;