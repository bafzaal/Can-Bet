import React, { useState } from "react";
import { NavLink, } from "react-router-dom";
import { login } from "../services/userService"
import { useNavigate } from "react-router-dom";

const Login = () => {

    let navigate = useNavigate();
    const [user, setUser] = useState({
    password: "",
    email: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = user;
    var result = await login(email, password)
    if(result === 'success'){
      localStorage.setItem("email", email)
      navigate('/', { replace: true })
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="container shadow my-5">
        <div className="row">
          <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center form">
            <h1 className="display-4 fw-bolder">Welcome Back</h1>
            <p className="lead text-center">Enter your Credentials to Login</p>
            <h5 className="mb-4">OR</h5>
            <NavLink
              to="/register"
              className="btn btn-outline-light rounded-pill pb-2 w-50"
            >
              Register
            </NavLink>
          </div>
          <div className="col-md-6 p-5">
            <h1 className="display-6 fw-bolder mb-5">LOGIN</h1>
            <form onSubmit={loginUser}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  name="email"
                  aria-describedby="emailHelp"
                  onChange={handleOnChange}
                  value={user.email}
                />
                <div id="emailHelp" className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="exampleInputPassword1"
                  onChange={handleOnChange}
                  value={user.password}
                />
              </div>
              <button
                type="submit"
                className="btn w-100 mt-4 rounded-pill btn-outline-danger"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

