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
    try {
      const req = await fetch("/authentication", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setIsTokenValidated(true);
          } else {
            setIsTokenValidated(false);
          }
          return response.json();
        })
        .then((response) => {
          const result = response["result"];
          if (result != null) {
            setUserId(result);
            return true;
          } else {
            setUserId("");
            return false;
          }
        });
    } catch (error) {
      console.log("error " + error);
    }
    return false;
  });

  const PrivateOutlet = () => {
    isLoggedIn();
    if (isTokenValidated) return <Outlet />;
    else return <Navigate to="/login" />;
  };

  useEffect(() => {
    setIsTokenValidated(isLoggedIn());
  }, []);

  return (
    <>
      <Navbar isAuth={isTokenValidated} id={userId} />
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/logout" element={<Logout />}></Route>
        {
          isTokenValidated ? (
            <Route element={<PrivateOutlet />}>
              <Route path="profile/:id" element={<Profile />} />
            </Route>
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
