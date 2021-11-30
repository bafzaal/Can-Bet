import React, {useEffect} from "react";
import { NavLink, useNavigate} from "react-router-dom";

const Logout = () => {

  let navigate = useNavigate();
 
  useEffect(() => {
    logoutUser()
  }, []);

  const logoutUser = async (e) => {
    try {
      const req = await fetch("/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (req.status == 202) {
        navigate('/', { replace: true })
      } else {
        window.alert("did not clear cookie");
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div></div>
  )
}


export default Logout;