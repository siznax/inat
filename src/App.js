import React, { Component } from 'react';
import './App.css';

const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/inaturalist/inaturalist/master/public/attachment_defaults/general/thumb.png';
const INAT = 'https://www.inaturalist.org';
const INAT_API = 'https://api.inaturalist.org/v1';


class ObservationCard extends Component {

  render() {
    const observation = this.props.observation;

    var photo = DEFAULT_PHOTO;
    if (observation.photos.length > 0) {
      photo = observation.photos[0].url;
    }

    var taxon = observation.taxon ? observation.taxon.name : 'taxon';
    var user = observation.user.login;
    var date = observation.observed_on;

    var observation_url = INAT + '/observations/' + observation.id;
    var observer_url = INAT + '/people/' + user;

    return (
      <div class="observationCard">
        <div class="photo">
          <a href={observation_url}><img src={photo} /></a></div>
        <div class="taxon"><i>{taxon}</i></div>
        <div class="date">{date}</div>
        <div class="user"><a href={observer_url}>@{user}</a></div>
      </div>
    );
  }
}

class ObservationsDiv extends Component {
  render() {
    const cards = [];

    this.props.observations.forEach((observation) => {
      cards.push(
        <ObservationCard
          observation={observation}
          key={observation.id} />
      )
    })

    return (
      <div id="observationsDiv">
        {cards}
      </div>
    );
  }
}

class FilterBar extends Component {
  render() {
    return (
      <form id="filterBarForm">
        <table>
          <tr>
            <td>Quality: </td>
            <td>
              <select name="quality">
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
              <select name="mediatype">
                <option value="any">Any</option>
                <option value="photos">Photos</option>
                <option value="sounds">Sounds</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Community: </td>
            <td>
              <select name="community">
                <option value="all">All</option>
                <option value="identified">Identified</option>
                <option value="popular">Popular</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Native: </td>
            <td>
              <select name="location">
                <option value="any">Any</option>
                <option value="endemic">Endemic</option>
                <option value="introduced">Introduced</option>
                <option value="native">Native</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Taxon: </td>
            <td><input name="taxon" type="text" /></td>
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
    fetch(INAT_API + "/observations?per_page=10&order=desc&order_by=created_at")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            results: result.results
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, results } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h3>Steve's iNat React App</h3>
          <FilterBar />
          <ObservationsDiv observations={results} />
        </div>
      );
    }
  }

}

export default App;
