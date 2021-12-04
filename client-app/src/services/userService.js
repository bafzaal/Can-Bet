const login = async (email, password) => {
  try {
    const req = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password, email: email }),
    });

    if (req.status === 400) {
      window.alert("Incorrect password");
      return "incorrect";
    } else {
      return "success";
    }
  } catch (error) {
    console.log(error);
  }
};

const register = async (username, password, email) => {
  try {
    const req = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    });

    if (req.status === 200) {
      return "success";
    } else {
      window.alert("could not register");
      return "error";
    }
    return req;
  } catch (error) {
    console.log(error);
  }
  
};

const logout = async () => {
  try {
    const req = await fetch("/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (req.status === 202) {
      return "success";
    } else {
      window.alert("did not clear cookie");
      return "failure";
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (id) => {
  try {
    var result;
    const req = await fetch("/profile?id=" + id , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        return false;
      };
      return response.json();
    })
    .then((response) => {
      var userDict = {};
      userDict["username"] = response["username"];
      userDict["email"] = response["email"];
      if (userDict.length !==  0) {
        result = userDict;
        return true;
      } else {
        return false;
      }
    });
    if (req.status === 200) {
      return "success";
    } else {
    }
  } catch (error) {
    console.log(error);
  }
  return result;
};

const resetPassword = async (oldPassword, newPassword, username, email,id) => {
  try {
    const req = await fetch("/newPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        oldPassword: oldPassword,
        password: newPassword,
        username: username,
        email: email,
        id: id,
      }),
    });
    if (req.status === 200) {
      return "success";
    } else {
      window.alert("could not update user");
      return "error";
    }
    return req;
  } catch (error) {
    console.log(error);
  }
  
};

const deleteUser = async (id, password) => {
  try {
    const req = await fetch("/profile?id=" + id , {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
      })
    })
    if (req.status === 200) {
      return "success";
    } else {
      window.alert("could not delete due to incorrect password");
      return "error";
    }
  } catch (error) {
    console.log(error);
  }
};
export { login, register, logout, resetPassword, getUser, deleteUser};
