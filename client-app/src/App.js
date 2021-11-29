import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/temp" element={<Login/>}></Route>
      </Routes>
    </>
  );
}

export default App;
