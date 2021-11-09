import React, {Component} from 'react';
import './App.css';
import Bikes from './components/Bikes'
import EmailSignIn from './components/EmailSign'
import GithubSignIn from './components/GHSignin'

class App extends Component {
  constructor(){
    super();
    this.state = {
      signedIn: false
    }
  };
  componentDidMount() {
    document.addEventListener("signedIn", async (event) => { 
      await this.setState({signedIn: event.detail})     
      this.forceUpdate()  
    })
  }

  render() {
    return(
      <div className="App" style={{ marginTop: "2.5%" }}>
        {
          !this.state.signedIn &&
          <div>
            <GithubSignIn />
            <br />
            <br />
            <br />
            <br />
            <EmailSignIn />
          </div>
        }
        { this.state.signedIn &&
          <Bikes />
        }
      </div>
    );
  }
}

export default App;