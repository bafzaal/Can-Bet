import React from "react";
import logo from '../images/Can-Bet-nobg.png'

const Navbar = () => {
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light shadow">
                <div class="container">
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Profile</a> {/*Placeholder*/}
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Dashboard</a> {/*Placeholder*/}
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Betting Lines</a> {/*Placeholder*/}
                            </li>
                        </ul>
                        <a class="navbar-brand fw-bolder fs-4 mx-auto" href="#"><img width="136" height="38" src={logo} /></a>
                        <button className="login-button btn btn-danger ms-auto px-4 rounded-pill">
                            <i className="fa fa-sign-in me-2"></i> Login</button>
                        <button className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                            <i className="fa fa-user-plus me-2"></i>Register</button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;