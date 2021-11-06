import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { initializeApp } from "firebase/app";
import config from './firebase/config'
import {getAuth, signInWithEmailAndPassword, signOut }from "firebase/auth"

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
};

initializeApp(firebaseConfig);

const auth = getAuth();
getAuth().onAuthStateChanged(function(user) {
  if(user) {
    document.dispatchEvent(new CustomEvent('signedIn', { detail: true }))
  }
  else {
    document.dispatchEvent(new CustomEvent('signedIn', { detail: false }))
  }
})

function login(event) {
  const email = event.email
  const password = event.password
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
}
function logout(event) {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export {login, logout}