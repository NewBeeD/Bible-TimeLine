import { Gamepage } from "./pages/Gamepage";
import { Homepage } from "./pages/Homepage";
import {Routes, Route} from 'react-router-dom'
import { LeaderBoard } from "./pages/LeaderBoard";




function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<Gamepage />} />
        <Route path="/leaderboard" element={<LeaderBoard/>} />  
      </Routes> 

    </div>
  );
}

export default App;
