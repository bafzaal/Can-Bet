import { React, useEffect, useState, useCallback} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profile from './components/Profile';


function App() {

  const [isTokenValidated, setIsTokenValidated] = useState(false);

  
  const isLoggedIn =  useCallback(async () => {
  
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

        setIsTokenValidated(true);

        return true;
      } 
      else 
      { 
        setIsTokenValidated(false);
 
        return false;
      }

    } catch (error) {
      console.log('error '+error);
    }
    return false;
    
  });
 

  const PrivateOutlet = () => {
 
 
    isLoggedIn();
    if(isTokenValidated) return  <Outlet />
    else return  <Navigate to="/login" />

    

  };
  useEffect(() => {

    setIsTokenValidated(isLoggedIn());

  }, [])




  return (

    <>
      <Navbar isAuth={isTokenValidated}/>
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
        {isTokenValidated ? 
      
        <Route element={<PrivateOutlet />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      :
      <Route exact path="/3" element={<Login />}></Route> // test to see if non auth users can access /3 while auth can
      
        }
        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
    </>


  );
}




export default App;
