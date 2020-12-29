import React from 'react'
import './Filter.css';

export class FilterState {

  constructor(source) {
    if(source) {
      this.diameter = {
        SDM: source.diameter.SDM,
        RDM: source.diameter.RDM
      };
    }
    else {
      this.diameter = {
        SDM: true,
        RDM: true
      };
    }
  }

  filter(mast) {
    return this.diameter[mast.size];
  }
}

export default class Filter extends React.Component {

  constructor(props) {
    super(props);
    this.diameterChanged = this.diameterChanged.bind(this);
  }
    
  render() {
    const state = this.props.state;
    return (
      <div id="filter">
        <label className="group">Size:</label>
        <div className="block">
          <input type="checkbox" id="SDM"
            checked={state.diameter.SDM}
            onChange={this.diameterChanged}
          />
          <label htmlFor="SDM">SDM</label>
        </div>
        <div className="block">
          <input type="checkbox" id="RDM"
            checked={state.diameter.RDM}
            onChange={this.diameterChanged}/>
          <label htmlFor="RDM">RDM</label>
        </div>
      </div>
    );
  }

  diameterChanged(event) {
    this.props.onChange(
      filterState => filterState.diameter[event.target.id] = event.target.checked
    );
  }
};
