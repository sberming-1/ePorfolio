var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');

function SelectLanguage (props) {
  var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {languages.map(function (lang) {
        return (
          <li
            style={lang === props.selectedLanguage ? {color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, lang)}
            key={lang}>
              {lang}
          </li>
        )
      })}
    </ul>
  )
}

function RepoGrid (props) {
  return (
    <ul className='popular-list'>
      {props.repos.map(function (repo, index) {
        return (
          <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img
                  className='avatar'
                  src={repo.owner.avatar_url}
                  alt={'Avatar for ' + repo.owner.login}
                />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired,
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

class Popular extends React.Component {
  render() {
    return (
      <div>

        <img src= 'http://www.molecularecologist.com/wp-content/uploads/2013/11/github-logo.jpg'></img>
        <p>
          This webpage is used to search for users on github and return some information about them.
        </p>
      </div>
    )
  }
}

module.exports = Popular;