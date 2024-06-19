// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDFze_CphPYA5PXWtRY6fNDU4kgAXkvwU",
  authDomain: "my-corner-2967f.firebaseapp.com",
  projectId: "my-corner-2967f",
  storageBucket: "my-corner-2967f.appspot.com",
  messagingSenderId: "1009065692058",
  appId: "1:1009065692058:web:74092fd1746ee5e61b8823",
  measurementId: "G-P0BYGKGEHN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const showLoading = () => {
  document.getElementById('loading-overlay').style.display = 'flex';
};

const hideLoading = () => {
  document.getElementById('loading-overlay').style.display = 'none';
};

const signUpHandler = (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const username = document.getElementById('signup-username').value;

  showLoading();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return set(ref(database, 'users/' + user.uid), {
        username: username,
        email: email
      });
    })
    .then(() => {
      alert('User Created!');
      // Clear the input fields
      document.getElementById('signup-email').value = '';
      document.getElementById('signup-password').value = '';
      document.getElementById('signup-username').value = '';
      // Redirect to login page
      document.getElementById('signup-page').style.display = 'none';
      document.getElementById('login-page').style.display = 'block';
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      hideLoading();
    });
};

const loginHandler = (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  showLoading();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return update(ref(database, 'users/' + user.uid), {
        last_login: new Date().getTime()
      });
    })
    .then(() => {
      alert('User Logged In!');
      // Clear the input fields
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
      // Redirect to main page
      window.location.href = 'main_page.html'; // Replace with your main page URL
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      hideLoading();
    });
};

// Add event listeners to buttons
document.getElementById('signUp').addEventListener('click', signUpHandler);
document.getElementById('login').addEventListener('click', loginHandler);

// Handle Enter key press for sign-up form
document.querySelectorAll('#signup-page input').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      signUpHandler(e);
    }
  });
});

// Handle Enter key press for login form
document.querySelectorAll('#login-page input').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginHandler(e);
    }
  });
});

document.getElementById('goToLogin').addEventListener('click', (e) => {
  document.getElementById('signup-page').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
});

document.getElementById('goToSignup').addEventListener('click', (e) => {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('signup-page').style.display = 'block';
});

document.getElementById('googleLogin').addEventListener('click', (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  showLoading();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // Optional: Store user info in the database if needed
      return set(ref(database, 'users/' + user.uid), {
        username: user.displayName,
        email: user.email,
        profile_picture: user.photoURL
      });
    })
    .then(() => {
      alert('Logged in with Google!');
      // Redirect to main page
      window.location.href = 'main_page.html'; // Replace with your main page URL
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      hideLoading();
    });
});
