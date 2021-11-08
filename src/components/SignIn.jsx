import React, {Component} from 'react'
import Button from '@mui/material/Button';

import {getAuth, signOut, GithubAuthProvider, signInWithPopup }from "firebase/auth"
import { initializeApp } from "firebase/app";
import config from '../firebase/config'

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId
};

const provider = new GithubAuthProvider();
initializeApp(firebaseConfig);

provider.setCustomParameters({
  'allow_signup': 'false'
});

const auth = getAuth();

getAuth().onAuthStateChanged(function(user) {
    if(user) {
      document.dispatchEvent(new CustomEvent('signedIn', { detail: true }))
    }
    else {
      document.dispatchEvent(new CustomEvent('signedIn', { detail: false }))
    }
})

const login = () => {
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });
}
function logout(event) {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
});
}

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }
    render(){
        return(    
            <Button onClick={login} variant="contained">Login</Button>
        )
    }
}

export default SignIn
export { logout }