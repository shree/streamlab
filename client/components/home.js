import React from 'react';

export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: "",
      chat: [],
      user: this.props.user
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.socket = io.connect();
    this.socket.on('new message', (data)=>{
      this.setState({
        chat: [...this.state.chat, [data.user,data.msg]]
      });
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      user: nextProps.user
    });
  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.socket.emit('send message', {message: this.state.message, user: this.state.user.name});
    $.ajax({
      url: "/saveMessages",
      type: 'POST',
      data: {
        message: this.state.message
      }
    })
    .then((data)=> {
      console.log("DB updated");
      this.setState({
        message: ''
      });
    })
    .fail((err) => {
      console.log("DB not updated");
      this.setState({
        message: ''
      });
    });
  }

  render() {
    return (
      <div className="container">
        {!this.state.user.id ? <h1>Please Login</h1> :
          <div className="row">
            <div className="col-xs-7">
              <iframe
              src="http://player.twitch.tv/?channel=savjz&muted=true"
              height="360"
              width="640"
              frameBorder="0"
              scrolling="no"
              allowFullScreen />
            </div>
            <div className="col-xs-5">
              <div className="well">
                <h4 style={{display:"flex", justifyContent:"center"}}>Chat Window</h4>
                {this.state.chat.map((item,idx) => (<div key={idx}>{item[0]}: {item[1]}</div>))}
              </div>

              <form id="messageForm" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <textarea className="form-control" value={this.state.message} onChange={this.handleChange} />
                  <input className="col-centered btn btn-primary" style={{margin:"4px"}} type="submit" value="Submit" />
                </div>
              </form>
            </div>
          </div>
        }
      </div>
    );
  }
}
