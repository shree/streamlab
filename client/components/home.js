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
            <div style={styleCenter}>
              <iframe
              src="https://player.twitch.tv/?channel=savjz&muted=true"
              height="360"
              width="640"
              frameBorder="0"
              scrolling="no"
              allowFullScreen />
            </div>
            <div style={styleCenter}>
              <iframe frameborder="0"
              scrolling="yes"
              id="chat_embed"
              src="https://www.twitch.tv/savjz/chat"
              height="360"
              width="640" />
            </div>
          </div>
        }
      </div>
    );
  }
}

var styleCenter = {
  display: "flex",
  justifyContent: "center"
}
