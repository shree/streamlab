import React from "react";
import Navbar from "./navbar";
import Home from "./home";
import Users from "./users";
import { BrowserRouter as Router , Route } from "react-router-dom";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      user: {}
    }
  }

  componentDidMount(){
    $.ajax({
      url: '/checkLogin'
    })
    .then((data)=> {
      this.setState({
        user: data
      });
    })
    .fail((err) => {
      this.setState({
        user: {}
      });
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar user={this.state.user}/>
          <Route exact path='/' component={(props) => (<Home {...props} user={this.state.user}/>)} />
          <Route path='/users' component={Users} />
        </div>
      </Router>
    );
  }
}
