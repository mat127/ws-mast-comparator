import React from 'react'
import './Filter.css';

export class FilterState {

  constructor(source) {
    if(source) {
      this.diameter = new Set(source.diameter);
      this.year = new Set(source.year);
      this.namePrefix = new Set(source.namePrefix);
    }
    else {
      this.diameter = new Set(['SDM', 'RDM']);
      this.year = new Set([2019]);
      this.namePrefix = new Set();
    }
  }

  static createDefaultOptions() {
    return {
      diameter: [],
      year: [],
      namePrefix: []
    };
  }

  static createOptions(data) {
    let options = {
      diameter: new Set(),
      year: new Set(),
      namePrefix: new Set()
    };
    data.forEach(
      function(mast) {
        options.diameter.add(mast.diameter);
        options.year.add(mast.year);
        options.namePrefix.add(mast.name.substr(0,1).toUpperCase());
      }
    );
    options = {
      diameter: Array.from(options.diameter),
      year: Array.from(options.year),
      namePrefix: Array.from(options.namePrefix)
    };
    options.year.sort((y1,y2) => y2-y1);
    options.namePrefix.sort();
    return options;
  }

  clone() {
    return new FilterState(this);
  }

  filter(mast) {
    return this.filterDiameter(mast.diameter)
      && this.filterYear(mast.year)
      && this.filterName(mast.name);
  }

  filterDiameter(diameter) {
    return this.diameter.size > 0 ? this.diameter.has(diameter) : true;
  }

  filterYear(year) {
    return this.year.size > 0 ? this.year.has(year) : true;
  }

  filterName(name) {
    const prefix = name.substr(0,1).toUpperCase();
    return this.namePrefix.size > 0 ? this.namePrefix.has(prefix) : true;
  }
}

export default class Filter extends React.Component {

  render() {
    const options = this.props.options;
    const state = this.props.state;
    return (
      <div id="filter">
        <FilterGroup
          label="Diameter:"
          options={options.diameter}
          state={state.diameter}
          onChange={e => this.diameterChanged(e)}
        />
        <FilterGroup
          label="Year:"
          options={options.year}
          state={state.year}
          onChange={e => this.yearChanged(e)}
        />
        <NamePrefixGroup
          options={options.namePrefix}
          state={state.namePrefix}
          onChange={e => this.namePrefixChanged(e)}
        />
      </div>
    );
  }

  diameterChanged(event) {
    const diameter = event.target.id;
    this.props.onChange(function(state) {
      if(event.target.checked)
        state.diameter.add(diameter);
      else
        state.diameter.delete(diameter);
    });
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

  namePrefixChanged(event) {
    const prefix = event.target.id;
    this.props.onChange(function(state) {
      if(state.namePrefix.has(prefix))
        state.namePrefix.delete(prefix);
      else
        state.namePrefix.add(prefix);
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

function NamePrefixGroup(props) {
  const options = props.options.map(
    function(prefix) {
      return <NamePrefixOption
        key={prefix} prefix={prefix}
        state={props.state}
        onChange={props.onChange}
      />;
    });
  return (
    <div>
      <label className="group">Producer:</label>
      {options}
    </div>
  );
}

function NamePrefixOption(props) {
  const isChecked = props.state.has(props.prefix);
  let className = 'name-prefix';
  if(isChecked)
    className += ' name-prefix-checked';
  return (
    <button
      className={className}
      id={props.prefix}
      onClick={props.onChange}
    >{props.prefix}</button>
  );
}
