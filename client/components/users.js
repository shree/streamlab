import React from 'react';
import { Link } from 'react-router-dom'

export default class Users extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userData: [],
      userMessages: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    $.ajax({
      url: "/getData"
    })
    .then((data) => {
      console.log(data);
      this.setState({
        userData: data
      });
    })
    .fail(() => {
      console.log("Something went wrong!");
    });
  }

  handleSubmit(userId){
    for(var j = 0; j < this.state.userData.length; j++){
      if(this.state.userData[j].id === userId){
        this.setState({
          userMessages: this.state.userData[j].messages
        });
        break;
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
              <div className="well">
                <h3 style={sideStyle}><strong>Users</strong></h3>
                {this.state.userData.map((user,idx) => (
                  <div style={sideStyle} key={idx}>
                    <button className="btn col-md-12" onClick={this.handleSubmit.bind(this, user.id)}>
                      {user.name}
                    </button>
                  </div>))}
              </div>
          </div>
          <div className="col-md-8">
              <div className="well">
                {this.state.userMessages.map((msg,idx) => (
                  <div key={idx}>{msg}</div>
                ))}
              </div>
          </div>
        </div>
      </div>
    );
  }
}

var sideStyle = {
  display:"flex",
  justifyContent:"center",
  margin: "10px"
};
