import { useEffect, useState, useCallback } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {

  const [valid, setValid] = useState(false);
  const [invalid, setInvalid] = useState(true);

  const PrivateOutlet = () => {
    isLoggedIn();
    if(invalid) return <Navigate to="/login" />
    if(valid) return <Outlet />
    else return <Navigate to="/login" />
  }
  
  const isLoggedIn = useCallback (async () => {
    try 
    {
      const req = await fetch("/authentication", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (req.status === 200) 
      {
        setValid(true);
        setInvalid(false);
      } 
      else 
      {
        setValid(false);
        setInvalid(true);
      }

    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    isLoggedIn();
  }, [isLoggedIn])

  return (
    <>
      <Navbar isAuth={valid}/>
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>

        <Route path="/profile" element={<PrivateOutlet />}>
          <Route path="" element={<Profile />} />
        </Route>

        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
    </>
  );
}


export default App;

