import React from 'react'
import './Filter.css';

export class FilterState {

  constructor(source) {
    if(source) {
      this.size = new Set(source.size);
      this.year = new Set(source.year);
    }
    else {
      this.size = new Set(['SDM', 'RDM']);
      this.year = new Set([2019]);
    }
  }

  static createDefaultOptions() {
    return {
      size: [],
      year: []
    };
  }

  static createOptions(data) {
    const years = data.reduce(
      (all,mast) => all.add(mast.year),
      new Set()
    );
    const sizes = data.reduce(
      (all,mast) => all.add(mast.size),
      new Set()
    );
    return {
      size: Array.from(sizes),
      year: Array.from(years)
    };
  }

  clone() {
    return new FilterState(this);
  }

  filter(mast) {
    return this.filterSize(mast.size)
      && this.filterYear(mast.year);
  }

  filterSize(size) {
    return this.size.size > 0 ? this.size.has(size) : true;
  }

  filterYear(year) {
    return this.year.size > 0 ? this.year.has(year) : true;
  }
}

export default class Filter extends React.Component {

  render() {
    const options = this.props.options;
    const state = this.props.state;
    return (
      <div id="filter">
        <FilterGroup
          label="Size:"
          options={options.size}
          state={state.size}
          onChange={e => this.sizeChanged(e)}
        />
        <FilterGroup
          label="Year:"
          options={options.year}
          state={state.year}
          onChange={e => this.yearChanged(e)}
        />
      </div>
    );
  }

  optionChanged(event, state) {
    if(event.target.checked)
      state.add(event.target.id);
    else
      state.delete(event.target.id);
  }
  
  sizeChanged(event) {
    this.props.onChange(
      state => this.optionChanged(event, state.size)
    );
  }

  yearChanged(event) {
    const year = parseInt(event.target.id);
    this.props.onChange(function(state) {
      if(event.target.checked)
        state.year.add(year);
      else
        state.year.delete(year);
    });
  }
};

function FilterGroup(props) {
  const items = props.options.map(
    (o) => (
      <FilterGroupOption
        key={o}
        id={o}
        checked={props.state.has(o)}
        onChange={props.onChange}
      />
    )
  );
  return (
    <div>
      <label className="group">{props.label}</label>
      {items}
    </div>
  );
}

function FilterGroupOption(props) {
  return (
    <div className="block">
      <input type="checkbox" {...props} />
      <label htmlFor={props.id}>{props.id}</label>
    </div>
  );
}