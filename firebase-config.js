// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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

export { app };
