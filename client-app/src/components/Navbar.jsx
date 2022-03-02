import React from "react";
import { NavLink, Link} from "react-router-dom";
import logo from '../images/Can-Bet-nobg.png'

const Navbar = (props) => {
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
                                <NavLink to="/" className="nav-link" aria-current="page" href="#">Home</NavLink> {/*Placeholder*/}
                            </li>
            
                            <li className="nav-item">
                                <NavLink to="/leaderboards" className="nav-link" href="#">Leaderboards</NavLink> {/*Placeholder*/}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/upcoming/games" className="nav-link" href="#">Games</NavLink> {/*Placeholder*/}
                            </li>
                            {props.isAuth ?     
                             <>

                              <li className="nav-item">
                                  <NavLink to="/place-bets" className="nav-link" href="#">Bets</NavLink> {/*Placeholder*/}
                              </li>

                              <li className="nav-item">
                                  <NavLink to="responsible-gambling" className="nav-link" href="#">Responsible Gambling</NavLink> {/*Placeholder*/}
                              </li>
                              <li className="nav-item">
                                  <NavLink to="betting-tips" className="nav-link" href="#">Betting Tips</NavLink> {/*Placeholder*/}
                              </li>
                  
                              </>:
                              <>
                              </>
                             }
                            
                        </ul>
                        <a className="navbar-brand fw-bolder fs-4 mx-auto" href="/"><img width="136" height="38" src={logo} /></a>
                        {props.isAuth ?       
                        <>

                        <Link className="btn btn-danger ms-auto px-4 rounded-pill" to={`profile/${props.id}`}>
                        <i className="fa fa-user me-2"></i>Profile
                        </Link>

                        <Link className="btn btn-outline-danger ms-2 px-4 rounded-pill" to={`account-settings/${props.id}`}>
                          <i className="bi bi-gear-fill me-2"></i>Settings
                        </Link>

                        <NavLink to="/logout" className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                        <i className="fa fa-user-plus me-2"></i>Logout</NavLink>
                        
                        </>:

                        <>
                        <NavLink to="/login" className="login-button btn btn-danger ms-auto px-4 rounded-pill">
                            <i className="fa fa-sign-in me-2"></i> Login</NavLink>
                        <NavLink to="/register" className="btn btn-outline-danger ms-2 px-4 rounded-pill">
                            <i className="fa fa-user-plus me-2"></i>Register</NavLink>
                        </>  
                        }
            
                  {/*Add Styling to this button*/}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;