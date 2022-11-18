import './App.css';
import Home from './Components/Home';
import Search from './Components/Search';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Home/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
