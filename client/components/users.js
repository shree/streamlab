import React from 'react';
import { Link } from 'react-router-dom'

export default class Users extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      userData: [],
      userMessages: [],
      user: "",
      query: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  handleClick(userName){
    for(var j = 0; j < this.state.userData.length; j++){
      if(this.state.userData[j].name === userName){
        this.setState({
          userMessages: this.state.userData[j].messages,
          user: this.state.userData[j].name
        });
        break;
      }
    }
  }

  handleChange(event){
    this.setState({
      query: event.target.value
    });
  }

  handleSubmit(event){
    event.preventDefault();
    this.setState({
      user: this.state.query,
      query: ""
    });
    var found = false;
    for(var i = 0; i < this.state.userData.length; i++){
      if(this.state.userData[i].name === this.state.query){
        this.setState({
          userMessages: this.state.userData[i].messages,
          user: this.state.userData[i].name,
          query: ""
        });
        found = true;
        break;
      }
    }
    if(!found){
      alert("User doesn't exist");
      this.setState({
        query: ""
      })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="input-group stylish-input-group" style={styleCenter}>
            <form onSubmit={this.handleSubmit} style={{width:"50%", marginBottom:"15px"}}>
              <div className="input-group">
                <input className='form-control' placeholder="Search User" type="text" value={this.state.query} onChange={this.handleChange} />
                <span className='input-group-btn'>
                <input className='btn btn-default' type="submit" value="Search"></input>
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
              <div className="well" style={{overflowY:"scroll", height:"83vh"}}>
                <h3 style={sideStyle}><strong>Users</strong></h3>
                {this.state.userData.map((user,idx) => (
                  <div style={sideStyle} key={idx}>
                    <button className="btn col-md-12" onClick={this.handleClick.bind(this, user.name)}>
                      {user.name}
                    </button>
                  </div>))}
              </div>
          </div>
          <div className="col-md-8" style={{overflowY:"scroll", height:"89vh"}}>
              <div className="well">

                {this.state.user !== "" ? <h4 style={{display:"flex",justifyContent:"center"}}>Messages of {this.state.user}</h4> : <h4 style={{display:"flex",justifyContent:"center"}}>Messages</h4> }
                {this.state.userMessages.map((msg,idx) => (
                  <div key={idx}>Message {idx}:{msg}</div>
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

var styleCenter = {
  display: "flex",
  justifyContent: "center"
}
