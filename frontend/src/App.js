import { Gamepage } from "./pages/Gamepage";
import { Homepage } from "./pages/Homepage";
import {Routes, Route} from 'react-router-dom'



function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<Gamepage />} />    
      </Routes> 

    </div>
  );
}

export default App;
