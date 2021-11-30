import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {
  Routes,
  Route,
  BrowserRouter,
  Link,
  Navigate,
  Outlet
} from "react-router-dom";
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/login" element={<Login/>}></Route>
        <Route exact path="/register" element={<Register/>}></Route>
        {/* <Route exact path="/profile" element={<Profile/>}></Route> */}
        <Route exact path="/logout" element={<Logout/>}></Route>

        <Route path="/profile" element={<PrivateOutlet />}>
          <Route path="" element={<Profile />} />
        </Route>

        {/* <Route exact path="/" element={}></Route> */}
      </Routes>
    </>
  );
}


const PrivateOutlet = async () => {
  const auth = await isLoggedIn();
  console.log('AUTHH ' + auth)
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

const isLoggedIn = async() => {
  try {
    const req = await fetch("/authentication", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (req.status == 200) {
      return true;
    } else {
      // alert('not logged in')
      return false;
      
    }
  } catch (error) {
    console.log(error);
  }
  
  return false;
}

export default App;