async function registerUser() {
  const usernameInput = document.getElementById("register-username");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const error = document.querySelector('.error-message');

  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Resetujemo poruke o greškama pre svakog novog pokušaja registracije
  error.innerHTML = '';

  
  if (!username) {
    error.innerHTML = 'Please enter a username';
    return;
  }else if(username.length<3){
    error.innerHTML='Username must include 3 or more characters';
    return;
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ;
  if (!emailRegex.test(email)) {
    error.innerHTML = 'Invalid email format';
    return;
  }

  const passwordRegex = /^(?=.*[A-Z]).{6,}$/;
  if (!passwordRegex.test(password)) {
    error.innerHTML = 'Password must include 6 characters and 1 uppercase letter';
    return;
  }

  try {
    // Slanje registracionih podataka na server
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Registration successful');
      usernameInput.value = '';
      emailInput.value = '';
      passwordInput.value = '';
    } else {
      error.innerHTML = 'Registration failed:Username or email already in use. Please choose a different one.';
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}
