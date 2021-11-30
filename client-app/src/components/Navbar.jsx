import React from "react";
import { NavLink } from "react-router-dom";
import logo from '../images/Can-Bet-nobg.png'

const Navbar = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light shadow">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link active" aria-current="page" href="#">Home</NavLink> {/*Placeholder*/}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" href="#">Dashboard</NavLink> {/*Placeholder*/}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" href="#">Betting Lines</NavLink> {/*Placeholder*/}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" href="#">Leaderboards</NavLink> {/*Placeholder*/}
                            </li>
                        </ul>
                        <a className="navbar-brand fw-bolder fs-4 mx-auto" href="#"><img width="136" height="38" src={logo} /></a>
                        <NavLink to="/login" className="login-button btn btn-danger ms-auto px-4 rounded-pill">
                            <i className="fa fa-sign-in me-2"></i> Login</NavLink>
                        <NavLink to="/logout" className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                            <i className="fa fa-user-plus me-2"></i>Logout</NavLink>
                        <NavLink to="/register" className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                            <i className="fa fa-user-plus me-2"></i>Register</NavLink>
                        <NavLink to="/profile" className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                            <i className="fa fa-user me-2"></i>Profile</NavLink> {/*Add Styling to this button*/}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;