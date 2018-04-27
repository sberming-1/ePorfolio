var React = require('react');
var Link = require('react-router-dom').Link;

class Home extends React.Component {
  render() {
    return (
      <div className='home-container'>
        <h1>Github Search: Search for your friends... and stuff.</h1>
        <Link className='button' to='/search'>Search</Link>
      </div>
    )
  }
}

module.exports = Home;