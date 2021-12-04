import { React, useEffect, useState, useCallback } from 'react';
import { resetPassword, getUser } from "../services/userService"
import { useParams } from "react-router-dom";

const Profile = (props) => {

  const { id } = useParams();
  const [changePassword, setChangePassword] = useState({
    password: "",
    newPassword: "",
  });

  const [user, setUser] = useState({
    username: "",
    email: "",
  });
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
    var result = await resetPassword(password, newPassword, id)
    if(result === 'success'){
      //navigate('/', { replace: true })
      window.location.reload();
    }
  };
  const retrieveUser = useCallback(async () => {
    var result = await getUser(id);
    if (result !== null) {
  
      return result;
    }
  });
  useEffect(() => {
  
      retrieveUser().then(result =>{
        setUser({username: result.username, email: result.email})
      });  
    
  }, []);
  return(
        <div>
          
        <div className="w-50 container shadow my-5">
          <div className = "w-100 text-center">
            <div className="p-5 d-inline-block">
              <h1 className="display-6 fw-bolder mb-5">Edit Profile</h1>
              <form onSubmit={newPasswordUser}>
              <div className="mb-3">
                  <label htmlFor="exampleInputUsername" className="form-label">
                    {user.email}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputName"
                    name="username"
                    aria-describedby="usernameHelp"

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
}

export default Profile;