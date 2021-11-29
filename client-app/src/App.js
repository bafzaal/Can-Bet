import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/register" element={<Register/>}></Route>
        <Route exact path="/profile" element={<Profile/>}></Route>
        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
    </>
  );
}

export default App;
