var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var api = require('../utils/api');
var Link = require('react-router-dom').Link;
var PlayerPreview = require('./PlayerPreview');
var Loading = require('./Loading');

function Profile (props) {
  var info = props.info;
  var stars = props.stars;
  console.log(stars);

  return (
    <PlayerPreview username={info.login} avatar={info.avatar_url}>
      <ul className='space-list-items'>
        {info.name && <li>{info.name}</li>}
        {info.location && <li>{info.location}</li>}
        {info.company && <li>{info.company}</li>}
        <li>Followers: {info.followers}</li>
        <li>Following: {info.following}</li>
        <li>Public Repos: {info.public_repos}</li>
        <li> Stars: {stars}</li>
        {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
      </ul>
    </PlayerPreview>
  )
}

Profile.propTypes = {
  info: PropTypes.object.isRequired,
}

function Player (props) {
  console.log(props)
  return (
    <div>
      <h1 className='header'>{props.label}</h1>
      <Profile info={props.profile} stars={props.stars} />
    </div>
  )
}

Player.propTypes = {
  label: PropTypes.string,
  profile: PropTypes.object.isRequired,
}

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    }
  }
  componentDidMount() {
    var players = queryString.parse(this.props.location.search);

    api.search([
      players.playerOneName
    ]).then(function (players) {
      if (players === null) {
        return this.setState(function () {
          return {
            error: 'Looks like there was an error. Check that both users exist on Github.',
            loading: false,
          }
        });
      }

      this.setState(function () {
        return {
          error: null,
          winner: players[0],
          loading: false,
        }
      });
    }.bind(this));
  }
  render() {
    var error = this.state.error;
    var winner = this.state.winner;
    var loser = this.state.loser;
    var loading = this.state.loading;

    if (loading === true) {
      return <Loading />
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to='/search'>Reset</Link>
        </div>
      )
    }

    return (
      <div className='row'>
        <Player
          profile={winner.profile}
          stars={winner.stars}
        />
      </div>
      
    )
  }
}

module.exports = Results;