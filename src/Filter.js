import React from 'react'
import './Filter.css';

export class FilterState {

  constructor(source) {
    if(source) {
      this.size = new Set(source.size);
      this.year = new Set(source.year);
      this.namePrefix = new Set(source.namePrefix);
    }
    else {
      this.size = new Set(['SDM', 'RDM']);
      this.year = new Set([2019]);
      this.namePrefix = new Set();
    }
  }

  static createDefaultOptions() {
    return {
      size: [],
      year: [],
      namePrefix: []
    };
  }

  static createOptions(data) {
    let options = {
      size: new Set(),
      year: new Set(),
      namePrefix: new Set()
    };
    data.forEach(
      function(mast) {
        options.size.add(mast.size);
        options.year.add(mast.year);
        options.namePrefix.add(mast.name.substr(0,1).toUpperCase());
      }
    );
    options = {
      size: Array.from(options.size),
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
    return this.filterSize(mast.size)
      && this.filterYear(mast.year)
      && this.filterName(mast.name);
  }

  filterSize(size) {
    return this.size.size > 0 ? this.size.has(size) : true;
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
        <NamePrefixGroup
          options={options.namePrefix}
          state={state.namePrefix}
          onChange={e => this.namePrefixChanged(e)}
        />
      </div>
    );
  }

  sizeChanged(event) {
    const size = event.target.id;
    this.props.onChange(function(state) {
      if(event.target.checked)
        state.size.add(size);
      else
        state.size.delete(size);
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
