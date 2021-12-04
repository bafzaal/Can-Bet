import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/userService";
const Logout = () => {
  let navigate = useNavigate();

  useEffect(() => {
    logoutUser();
  }, []);

  const logoutUser = async (e) => {
      
    var result = await logout();

    if (result === "success") {
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  return <div></div>;
};

export default Logout;
