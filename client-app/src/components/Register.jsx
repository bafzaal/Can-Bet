import React, {useState} from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { register } from "../services/userService"

const Register = () => {

    let navigate = useNavigate();

    const [user, setUser] = useState({
      username : '',
      password : '',
      email : ''
    });

    const handleOnChange = event => {
      const { name, value } = event.target;
      setUser({ ...user, [name]: value });
    };
    const registerUser = async (e) => {
      e.preventDefault();
      const {username, password, email} = user;
      var result = await register(username, password, email)
      if(result === 'success'){
        navigate('/login', { replace: true })
        window.location.reload();
      }
    }
    
     
    return (
        <div>
            <div className="container shadow my-5">
                <div className="row justify-content-end">
                    <div className="col-md-5 d-flex flex-column align-items-center text-white justify-content-center order-2 form">
                        <h1 className="display-4 fw-bolder">Create Account</h1>
                        <p className="lead text-center">Enter your details to register</p>
                        <h5 className="mb-4">OR</h5>
                        <NavLink to="/login" className="btn btn-outline-light rounded-pill pb-2 w-50">Log In</NavLink>
                    </div>
                    <div className="col-md-6 p-5">
                        <h1 className="display-6 fw-bolder mb-5">REGISTER</h1>
                        <form onSubmit={registerUser}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Username</label>
                                <input type="text" className="form-control" name="username" id="name" onChange={handleOnChange} value = {user.username} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" className="form-control" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleOnChange} value = {user.email} />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input type="password" className="form-control" name="password" id="exampleInputPassword1" onChange={handleOnChange} value = {user.password} />
                            </div>
                            <button type="submit" className="btn w-100 mt-4 rounded-pill btn-outline-danger">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default Register;