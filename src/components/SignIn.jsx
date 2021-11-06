import React, {Component} from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {login} from '../index'

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }
    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
     }
     handlePasswordChange = (e) => {
        this.setState({password: e.target.value});
     }
    handleSubmit = (event) => {
        event.preventDefault();
        const y = this.state.email
        const x = this.state.password
        login({"email": y, "password": x})
    }
    render(){
         
        return(   
            <form onSubmit = {this.handleSubmit}>
                <TextField onChange = {this.handleEmailChange} type="text" variant="filled" name="email" type="username" placeholder="email"/>
                
            <br />    
            
                <TextField onChange = {this.handlePasswordChange}type="text" variant="filled" name="password" type="password" placeholder="password" />
            
            <br />
            <br />
                <Button  type="submit" variant="contained" >Sign In</Button>
            </form>
        )
    }
}

export default SignIn