import React, { Component } from 'react';
import './App.css';

class ObservationCard extends Component {
  render() {
    const observation = this.props.observation;
    return (
      <div class="observationCard">
        <div class="photo">{observation.photo}</div>
        <div class="taxon">{observation.taxon}</div>
        <div class="user">{observation.user}</div>
        <div class="date">{observation.date}</div>
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
  render() {
    return (
      <div>
        <h1>Steve's iNat React App</h1>
        <FilterBar />
        <ObservationsDiv observations={this.props.observations} />
      </div>
    );
  }
}

export default App;
