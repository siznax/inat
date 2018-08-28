import React, { Component } from 'react';
import './App.css';

class ObservationCard extends Component {
  render() {
    const observation = this.props.observation;
    var photo = 'https://raw.githubusercontent.com/inaturalist/inaturalist/master/public/attachment_defaults/general/thumb.png';
    var taxon = observation.taxon ? observation.taxon.name : 'taxon';
    var user = observation.user.login;
    var date = observation.observed_on;
    return (
      <div class="observationCard">
        <div class="photo"><img src={photo} /></div>
        <div class="taxon"><i>{taxon}</i></div>
        <div class="date">{date}</div>
        <div class="user">@{user}</div>
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
        <div className="radio">
          <label>
            <input type="radio" value="quality_grade_research" />
              Research
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="quality_grade_needs_id" checked={true}/>
              Needs ID
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="quality_grade_casual" />
              Casual
          </label>
        </div>
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
    fetch("https://api.inaturalist.org/v1/observations?per_page=10&order=desc&order_by=created_at")
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
          <h1>Steve's iNat React App</h1>
          <FilterBar />
          <ObservationsDiv observations={results} />
        </div>
      );
    }
  }

}

export default App;
