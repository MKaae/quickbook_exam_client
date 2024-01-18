import { API_URL } from '../../settings.js'
import { handleHttpErrors } from '../../utility.js'


export function initLogin(match) { //Match not used
  document.querySelector('#login-btn').addEventListener("click", login)
}

async function login() {
    event.preventDefault();
    document.querySelector("#login-fail").innerText = "" //Clears the error message
    const userNameInput = document.querySelector('#username') 
    const passwordInput = document.querySelector('#password')
    const loginRequest = {
      username: userNameInput.value,  
      password: passwordInput.value
    }
    const options = {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginRequest)
    }
    try {
      const res = await fetch(API_URL + "/auth/login", options).then((r) =>
        handleHttpErrors(r)
      );
  
      storeLoginDetails(res);
      window.router.navigate("/");
    } catch (err) {
      if (err.message === "Incorrect username or password") {
        document.querySelector("#login-fail").innerText =
          "Forkert brugernavn eller kodeord."; 
      }
    }
  }
  
  function storeLoginDetails(res) {
    localStorage.setItem("token", res.token)
    localStorage.setItem("user", res.username)
    localStorage.setItem("roles", res.roles)
    toggleLoginStatus(true)
  }
  export function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("roles")
  toggleLoginStatus(false)
  window.router.navigate("/")
}

export function toggleLoginStatus(loggedIn) {
  const navBar = document.querySelector('.navbar');
  navBar.style.display = "block";
  document.querySelector('#login-container').style.display = loggedIn ? "none" : "block"
  document.querySelector('#logout-container').style.display = loggedIn ? "block" : "none"
  document.querySelector('#signup-container').style.display = loggedIn ? "none" : "block"
  
  const adminListItems = document.querySelectorAll('.admin-only');
  const guestRoutes = document.querySelector('.guest-only');
  let isAdmin = false;
  let isUser = false;
  if (localStorage.getItem('roles')) {
     isAdmin = localStorage.getItem('roles').includes('ADMIN');
     isUser = localStorage.getItem('roles').includes('GUEST');
  }
  for (var i = 0; i < adminListItems.length; i++) {
    adminListItems[i].style.display = isAdmin ? "block" : 'none'; //If there is no admin routes, this will be null and throw an error.
  }
  for (var i = 0; i < adminListItems.length; i++) {
  guestRoutes.style.display = isUser ? 'block' : 'none'; //If there is no guest routes, this will be null and throw an error.
  }  
}

  