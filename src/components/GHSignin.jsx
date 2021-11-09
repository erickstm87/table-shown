import React, {Component} from 'react'
import Button from '@mui/material/Button';
import { getAuth }from "firebase/auth"

import { ghLogin } from '../signIn/signInForm'

getAuth().onAuthStateChanged(function(user) {
    if(user) {
      document.dispatchEvent(new CustomEvent('signedIn', { detail: true }))
    }
    else {
      document.dispatchEvent(new CustomEvent('signedIn', { detail: false }))
    }
})

class GithubSignIn extends Component {
    render(){
        return(    
            <Button onClick={ghLogin} variant="contained">GH Login</Button>
        )
    }
}

export default GithubSignIn