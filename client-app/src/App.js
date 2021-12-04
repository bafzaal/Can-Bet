import { React, useEffect, useState, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import Profile from "./components/Profile";

function App() {
  
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  const [userId, setUserId] = useState("");

  const isLoggedIn = useCallback(async () => {

    var result ={auth:false, id:'' }
    try {
      const req = await fetch("/authentication", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            result.auth=true;
          } 
          return response.json();
        })
        .then((response) => {
          const data = response["result"];
          if (data != null) {
            result.id = data
          }
        });
    } catch (error) {
      console.log("error " + error);
    }
    return result;
  });


  useEffect(() => {

    isLoggedIn().then(result =>{
      console.log(result)
      setIsTokenValidated(result.auth);
      setUserId(result.id);
   
    });         
  
  }, []);

  return (
    <>
      <Navbar isAuth={isTokenValidated} id={userId} />
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
         {isTokenValidated ? (
            <Route path="profile/:id" element={<Profile />} />
          ) : (
            <Route exact path="/3" element={<Login />}></Route>
          ) // test to see if non auth users can access /3 while auth can
        } 
        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
    </>
  );
}

export default App;
