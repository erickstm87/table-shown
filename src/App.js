import React, {Component} from 'react';
import './App.css';
import Bikes from './components/Bikes'
import SignIn from './components/SignIn'

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
      <div className="App">
        {
          !this.state.signedIn &&
          <SignIn />
        }
        { this.state.signedIn &&
          <Bikes />
        }
      </div>
    );
  }
}

export default App;