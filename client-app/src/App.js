import { React, useEffect, useState, useCallback } from "react";
import "./App.css";
import "./scss/style.scss";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import AccountSettings from "./components/AccountSettings";
import Home from "./components/Home";
import UpcomingGames from "./components/UpcomingGames";
import PlaceBets from "./components/PlaceBets";
import Profile from "./components/Profile";
import Leaderboards from "./components/Leaderboards";
import ResponsibleGambling from "./components/ResponsibleGambling";
import BettingTips from "./components/BettingTips";
import Footer from './components/Footer';

function App() {
  
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const isLoggedIn = useCallback(async () => {

    var result ={auth:false, id:'', email:'' }
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
          const id = response["id"];
          const email = response["email"];
          if (id != null) {
            result.id = id
            result.email = email
          }
        });
    } catch (error) {
      console.log("error " + error);
    }
    return result;
  });


  useEffect(() => {

    isLoggedIn().then(result =>{
      setIsTokenValidated(result.auth);
      setUserId(result.id);
      setUserEmail(result.email);
    });         
  
  }, []);

  return (
    <>
      <Navbar isAuth={isTokenValidated} id={userId} />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/upcoming/games" element={<UpcomingGames userId={userId} loggedIn={isTokenValidated} />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
        <Route exact path="/leaderboards" element={<Leaderboards />}></Route>
        <Route path="/profile/:id" element={<Profile id={userId} email={userEmail}/>}></Route>
        <Route exact path="/responsible-gambling" element={<ResponsibleGambling />}></Route>
        <Route exact path="betting-tips" element={<BettingTips />}></Route>
         {isTokenValidated ? (
           <>
            <Route path="/account-settings/:id" element={<AccountSettings />}>  
            </Route>
            <Route path="/place-bets" element={<PlaceBets id={userId} />}></Route>
            </>
          ) : (
            <Route exact path="/3" element={<Login />}></Route>
          ) // test to see if non auth users can access /3 while auth can
        } 
        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
