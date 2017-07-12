import React from 'react';

export default class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: "",
      chat: [],
      user: this.props.user,
      channel: "bmkibler",
      query: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      user: nextProps.user
    });
  }

  handleChange(event) {
    this.setState({query: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    var channel = this.state.query;
    this.setState({
      channel: channel,
      query: ""
    });

    $.ajax({
      url:"/updateChannel",
      data: {
        channel : this.state.channel
      }
    })
    .then((data)=> {
      // console.log("Getting messages from %s",this.state.channel);
    })
    .fail(()=>{
      console.log("Backend did not update");
    })
  }

  render() {
    return (
      <div>
      {!this.state.user.id ? <div className="container"><h1>Please Login</h1></div>:
        <div className="container">
          <div className="row">
            <div className="input-group stylish-input-group" style={styleCenter}>
              <form onSubmit={this.handleSubmit} style={{width:"50%", marginBottom:"15px"}}>
                <div className="input-group">
                  <input className='form-control' placeholder="Search Channel" type="text" value={this.state.query} onChange={this.handleChange} />
                  <span className='input-group-btn'>
                  <input className='btn btn-default' type="submit" value="Search"></input>
                  </span>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <iframe
              src={"https://player.twitch.tv/?channel="+this.state.channel+"&muted=true"}
              frameBorder="0"
              scrolling="no"
              height="360"
              width="640"
              allowFullScreen />
            </div>
            <div className="col-md-1">
            </div>
            <div className="col-md-4">
              <iframe frameborder="0"
              scrolling="yes"
              id="chat_embed"
              src={"https://www.twitch.tv/"+this.state.channel+"/chat"}
              height="360"
              width="400" />
            </div>
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

// <div class="row">
//   <div class="col-sm-6 col-sm-offset-3">
//     <div id="imaginary_container">
//       <div class="input-group stylish-input-group">
//         <input type="text" class="form-control"  placeholder="Search" />
//         <span class="input-group-addon">
//           <button type="submit">
//             <span class="glyphicon glyphicon-search"></span>
//           </button>
//         </span>
//       </div>
//     </div>
//   </div>
// </div>



// <form style={{width:"60%", marginBottom:"15px"}} onSubmit={this.handleSubmit}>
//   <div className='input-group' >
//     <input type='text' className='form-control' placeholder='Search Channel' value={this.state.query} onChange={this.handleChange} />
//     <span className='input-group-btn'>
//       <input className='btn btn-default' type="sumbit" value="Submit"><span className='glyphicon glyphicon-search' /></input>
//     </span>
//   </div>
// </form>


// <form onSubmit={this.handleSubmit}>
//   <label>
//     Name:
//     <input type="text" value={this.state.query} onChange={this.handleChange} />
//   </label>
//   <input type="submit" value="Submit" />
// </form>
