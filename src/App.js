import React, { Component } from 'react';
import './App.css';

const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/inaturalist/inaturalist/master/public/attachment_defaults/general/thumb.png';
const REPO_URL = 'https://github.com/siznax/inat';

const INAT = 'https://www.inaturalist.org';
const INAT_API = 'https://api.inaturalist.org/v1';


class ObservationCard extends Component {
  render() {
    const observation = this.props.observation;
    const number = this.props.count;

    let photo = DEFAULT_PHOTO;
    if (observation.photos.length > 0) {
      photo = observation.photos[0].url;
    }

    let taxon = observation.taxon ? observation.taxon.name : 'taxon';
    let user = observation.user.login;
    let date = observation.observed_on;

    // observation.uri ?
    let observation_url = INAT + '/observations/' + observation.id;
    let observer_url = INAT + '/people/' + user;

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
    let cards = [];
    let count = 0;

    this.props.data.results.forEach((observation) => {
      count += 1;
      cards.push(
        <ObservationCard
          count={count}
          observation={observation}
          key={observation.id} />
      )
    })

    return (
      <div>
        <div id="SummaryDiv">
          <table id="SummaryTable">
            <tr>
              <td>Total: {this.props.data.total_results.toLocaleString()}</td>
              <td>Per page: {this.props.data.per_page}</td>
              <td>Page: {this.props.data.page}</td>
            </tr>
          </table>
        </div>
        <div id="observationsDiv">
          {cards}
        </div>
      </div>
    );
  }
}


class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      summary: null,
      observations: [],
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
    event.preventDefault();

    let api_args = [];
    let fetch_url = INAT_API + '/observations?';

    if (this.state.quality !== 'any') {
      if (this.state.quality === 'verifiable') {
        api_args.push('verifiable=true');
      } else {
        api_args.push('quality_grade=' + this.state.quality);
      }
    }

    if (this.state.mediatype === 'photos')
      api_args.push('photos=true')
    if (this.state.mediatype === 'sounds')
      api_args.push('sounds=true')
    if (this.state.community === 'identified')
      api_args.push('identified=true')
    if (this.state.community === 'popular')
      api_args.push('popular=true')
    if (this.state.nativity === 'endemic')
      api_args.push('endemic=true')
    if (this.state.nativity === 'introduced')
      api_args.push('introduced=true')
    if (this.state.nativity === 'native')
      api_args.push('native=true')
    if (this.state.taxon)
      api_args.push('taxon_name=' + this.state.taxon)

    if (api_args.length > 0) {
      fetch_url += api_args.join('&');

      alert(
        'quality: ' + this.state.quality
        + '\nmediatype: ' + this.state.mediatype
        + '\ncommunity: ' + this.state.community
        + '\nnativity: ' + this.state.nativity
        + '\ntaxon: ' + this.state.taxon
        + '\nfetch: ' + fetch_url);

      fetch(fetch_url)
        .then(res => res.json())
        .then(
          (result) => {
            alert(result.total_results);
            this.setState({
              isLoaded: true,
              summary: {
                total: result.total_results,
                page: result.page,
                per_page: result.per_page
              },
              observations: result.results
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
  }

  render() {
    const { error, isLoaded, summary, observations } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <form id="filterForm" onSubmit={this.handleSubmit}>
          <table>
            <tr>
              <td>Quality: </td>
              <td>
                <select name="quality" onChange={this.handleChange}>
                  <option value="any">Any</option>
                  <option value="casual">Casual</option>
                  <option value="needs_id">Needs ID</option>
                  <option value="research">Research</option>
                  <option value="verifiable">Verifiable</option>
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
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: []
    };
  }

  componentDidMount() {
    fetch(INAT_API + "/observations")
      .then(res => res.json())
      .then(
        result => this.setState({isLoaded: true, data: result}),
        error => this.setState({isLoaded: true, error})
      )
  }

  render() {
    const { error, isLoaded, data } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div id="header">
            <h3>Steve's iNat React App (post-challenge)</h3>
            <p><a href={REPO_URL}>{REPO_URL}</a></p>
          </div>
          <FilterForm />
          <ObservationsDiv data={data} />
        </div>
      );
    }
  }

}

export default App;
