import React from "react";
import { NavLink } from 'react-router-dom';

const Register = () => {
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
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Username</label>
                                <input type="text" className="form-control" id="name" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" />
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