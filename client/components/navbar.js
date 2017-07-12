import React from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: this.props.user,
      searchQuery: ''
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

  handleChange(){
    this.setState({searchQuery: event.target.value});
  }

  handleSubmit(){

  }

  render() {
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            <div style={brandStyle}><strong>Stream</strong></div>
          </Link>
        </div>

        <div id='navbar' className='navbar-collapse collapse' style={loginStyle}>
            {!this.state.user.name ?
            <ul className='nav navbar-nav'>
              <li><a href="/auth/google"><strong>Login with Google</strong></a></li>
            </ul> :
            (<ul className='nav navbar-nav'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/users'>Messages</Link>
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>)}
        </div>
      </nav>
    );
  }
}

var brandStyle = {
  fontSize:"24px",
  paddingLeft:"50px",
  color:"red"
};

var loginStyle = {
  float:"right",
  fontSize:"16px",
  paddingRight:"30px"
};
