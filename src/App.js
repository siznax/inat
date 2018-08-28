import React, { Component } from 'react';
import './App.css';

const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/inaturalist/inaturalist/master/public/attachment_defaults/general/thumb.png';
const DEMO_URL = 'https://siznax.github.com/inat';

const INAT = 'https://www.inaturalist.org';
const INAT_API = 'https://api.inaturalist.org/v1';


class ObservationCard extends Component {

  render() {
    const observation = this.props.observation;
    const number = this.props.count;

    var photo = DEFAULT_PHOTO;
    if (observation.photos.length > 0) {
      photo = observation.photos[0].url;
    }

    var taxon = observation.taxon ? observation.taxon.name : 'taxon';
    var user = observation.user.login;
    var date = observation.observed_on;

    // observation.uri ?
    var observation_url = INAT + '/observations/' + observation.id;
    var observer_url = INAT + '/people/' + user;

    return (
      <div class="observationCard">
        <div class="photo">
          <a href={observation_url}><img alt="" src={photo} /></a></div>
        <div class="taxon">{number}. <i>{taxon}</i></div>
        <div class="user"><a href={observer_url}>@{user}</a></div>
        <div class="date">{date}</div>
      </div>
    );
  }
}


class ObservationsDiv extends Component {
  render() {
    const cards = [];
    var count = 0;

    this.props.observations.forEach((observation) => {
      count += 1;
      cards.push(
        <ObservationCard
          count={count}
          observation={observation}
          key={observation.id} />
      )
    })

    return (<div id="observationsDiv">{ cards }</div>);
  }
}


class SummaryDiv extends Component {
  render() {
    const total = this.props.summary.total;
    const page = this.props.summary.page;
    const per_page = this.props.summary.per_page;
    return (
      <div id="SummaryDiv">
        <table id="SummaryTable">
          <tr>
            <td>Total: {total.toLocaleString()}</td>
            <td>Per page: {per_page}</td>
            <td>Page: {page}</td>
          </tr>
        </table>
      </div>
    );
  }
}


class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quality: 'any',
      mediatype: 'any',
      community: 'all',
      nativity: 'any',
      taxon: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    alert(
      'quality: ' + this.state.quality
      + '\nmediatype: ' + this.state.mediatype
      + '\ncommunity: ' + this.state.community
      + '\nnativity: ' + this.state.nativity
      + '\ntaxon: ' + this.state.taxon);
    // fetch
    event.preventDefault();
  }

  render() {
    return (
      <form id="filterForm" onSubmit={this.handleSubmit}>
        <table>
          <tr>
            <td>Quality: </td>
            <td>
              <select name="quality" onChange={this.handleChange}>
                <option value="any">Any</option>
                <option value="needs_id">Needs ID</option>
                <option value="research">Research</option>
                <option value="casual">Casual</option>
                <option value="varifiable">Verifiable</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Media: </td>
            <td>
              <select name="mediatype" onChange={this.handleChange}>
                <option value="any">Any</option>
                <option value="photos">Photos</option>
                <option value="sounds">Sounds</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Community: </td>
            <td>
              <select name="community" onChange={this.handleChange}>
                <option value="all">All</option>
                <option value="identified">Identified</option>
                <option value="popular">Popular</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Nativity: </td>
            <td>
              <select name="nativity" onChange={this.handleChange}>
                <option value="any">Any</option>
                <option value="endemic">Endemic</option>
                <option value="introduced">Introduced</option>
                <option value="native">Native</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Taxon: </td>
            <td>
                <input
                  type="text"
                  name="taxon"
                  placeholder="taxon name"
                  onChange={this.handleChange}/>
            </td>
          </tr>

          <tr>
            <td></td>
            <td><input type="submit" /></td>
          </tr>

        </table>
      </form>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      results: []
    };
  }

  componentDidMount() {
    fetch(INAT_API + "/observations")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            result: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, result } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const summary = {
        total: result.total_results,
        page: result.page,
        per_page: result.per_page
      }
      return (
        <div>
          <div id="header">
            <h3>Steve's iNat React App</h3>
            <p><a href={DEMO_URL}>{DEMO_URL}</a></p>
          </div>
          <FilterForm />
          <SummaryDiv summary={summary} />
          <ObservationsDiv observations={result.results} />
        </div>
      );
    }
  }

}

export default App;
