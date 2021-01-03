import React from 'react'
import './Filter.css';

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
        <button className="clear" onClick={e => this.clearYearFilter()}>Clear</button>
        <NamePrefixGroup
          options={options.namePrefix}
          state={state.namePrefix}
          onChange={e => this.namePrefixChanged(e)}
        />
        <button className="clear" onClick={e => this.clearNamePrefixFilter()}>Clear</button>
      </div>
    );
  }

  diameterChanged(event) {
    const diameter = event.target.id;
    this.props.onChange(function(state) {
      state.selectDiameter(diameter, event.target.checked);
    });
  }

  yearChanged(event) {
    const year = parseInt(event.target.id);
    this.props.onChange(function(state) {
      state.selectYear(year, event.target.checked);
    });
  }

  clearYearFilter() {
    this.props.onChange(function(state) {
      state.clearYear();
    });
  }

  namePrefixChanged(event) {
    const prefix = event.target.id;
    this.props.onChange(function(state) {
      state.toggleNamePrefix(prefix);
    });
  }

  clearNamePrefixFilter() {
    this.props.onChange(function(state) {
      state.clearNamePrefix();
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
    <div className="group">
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
    <div className="group">
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
