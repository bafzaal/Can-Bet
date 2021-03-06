import { React, useEffect, useState, useCallback } from 'react';
import { resetPassword, getUser, deleteUser} from "../services/userService"
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AccountSettings = (props) => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [changePassword, setChangePassword] = useState({
    password: "",
    newPassword: "",
  });

  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  const [betLimit, setBetLimit] = useState(0);

  const handleOnPasswordChange = (event) => {
    const { name, value } = event.target;
    setChangePassword({ ...changePassword, [name]: value });
  };
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
  const newPasswordUser = async (e) => {
    e.preventDefault();
    const {password, newPassword } = changePassword;
    const {username, email} = user;
    if (window.confirm('Are you sure you wish to update this user?')){
    var result = await resetPassword(password, newPassword, username, email, id)
    if(result === 'success'){
      //navigate('/', { replace: true })
      window.location.reload();
    }
  }
  };
  const retrieveUser = useCallback(async () => {
    var result = await getUser(id);
    if (result !== null) {
  
      return result;
    }
  });
  const removeUser = async(e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you wish to delete this item?')){
      var result = await deleteUser(id, changePassword.password)
      if(result === 'success'){
        navigate('/login', { replace: true })
        window.location.reload();
      }
    }
  }
  useEffect(() => {
  
      retrieveUser().then(result =>{
        setUser({username: result.username, email: result.email})
      });  
    
  }, []);

  const setNewBetLimit = (event) => {
    //e.preventDefault();
    const { name, value } = event.target;
    setBetLimit(value)

    // UPDATE user db by id
    
  };

  const newBetLimit = async (e) => {
    let betLimitUrl = "http://localhost:3001/api/update-user-bet-limit";
    await axios
      .put(betLimitUrl, {
        "id": id,
        "oldPassword": changePassword.password,
        "username": user.username,
        "email": user.email,
        "stakeLimit": betLimit 
      })
      .then(function(response) {
        console.log(response)
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  const submitForm = (e) => {
    if(changePassword.newPassword == "" || changePassword.newPassword == null) {
      if(betLimit) {
        newBetLimit(e)
      }
    } else {
      newPasswordUser(e)
    }
  }
  return(
        <div>
          
        <div className="w-50 container shadow my-5">
          <div className = "w-100 text-center">
            <div className="p-5 d-inline-block">
              <h1 className="display-6 fw-bolder mb-5">Edit Account Settings</h1>
              <form onSubmit={submitForm}>
              <div className="mb-3">
                  <label htmlFor="exampleInputUsername" className="form-label">

                    Username
                  </label>
                  <input
                    type="username"
                    className="form-control"
                    id="exampleInputName"
                    name="username"
                    aria-describedby="usernameHelp"
                    placeholder = {user.username}
                    onChange={handleOnChange}
                    value={user.username}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    name="email"
                    aria-describedby="emailHelp"
                    placeholder = {user.email}
                    onChange={handleOnChange}
                    value={user.email}
                  />
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
                    onChange={handleOnPasswordChange}
                    value={changePassword.password}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputNewPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    id="exampleInputNewPassword"
                    onChange={handleOnPasswordChange}
                    value={changePassword.newPassword}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputBetLimit" className="form-label">
                    Stake Limit
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="betLimit"
                    id="exampleInputBetLimit"
                    onChange={setNewBetLimit}
                    value={user.betLimit}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 mt-4 mb-3 rounded-pill btn-outline-danger" disabled={changePassword.password.length<1}>
                  Submit
                </button>
                <button className="btn btn-danger btn-sm rounded-0" onClick={removeUser} disabled={changePassword.password.length<1} type="button" data-toggle="tooltip" data-placement="top" title="Delete"><i className="fa fa-trash"></i></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AccountSettings;