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
export { login, register, logout };
