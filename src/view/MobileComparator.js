import React from 'react'

import {ProfileClass} from '../model/MastDataModel.js';

import './MobileComparator.css';

export default function MobileComparator(props) {

  const comparator = props.comparator;
  const filter = comparator.state.filter;
  const filtered = comparator.getFiltered();

  const filterComponent = filter.state.visible ?
    <Filter
      state={filter.state}
      options={filter.options}
      onChange={c => comparator.filterChanged(c)}
    /> :
    undefined;

  return (
    <div id="mobile-comparator">
      <ComparatorHeader
        isFilterVisible={filter.state.visible}
        onShowFilter={() => comparator.showFilter()}
        onHideFilter={() => comparator.hideFilter()}
        onSortByName={() => comparator.sortByNameAscending()}
      />
      {filterComponent}
      <table id="mobile-comparator-table">
        <tbody>
          <MastBrowser
            model={filtered}
            comparator={comparator}
          />
        </tbody>
      </table>
    </div>
  );
}

function ComparatorHeader(props) {
  const filterButton = props.isFilterVisible ?
    <HideFilterButton onClick={props.onHideFilter} /> :
    <ShowFilterButton onClick={props.onShowFilter} />;
  return [
    <table className="mobile-app-header" key="1"><thead><tr>
      <td><h1>Mast Profile Comparator</h1></td>
      <td className="mobile-app-menu">
        <button onClick={props.onSortByName}>
          <i className="fa fa-sort-alpha-asc" aria-hidden="true"></i>
        </button>
        {filterButton}
      </td>
    </tr></thead></table>,
    <div className="mobile-app-header-spacer" key="2"></div>
  ];
}

function ShowFilterButton(props) {
  return (
    <button {...props}>
      <i className="fa fa-filter" aria-hidden="true"></i>
    </button>
  );
}

function HideFilterButton(props) {
  return (
    <button {...props}>
      <i className="fa fa-times" aria-hidden="true"></i>
    </button>
  );
}

function MastBrowser(props) {
  return props.model
    .map((m) => <MastRow {...props} mast={m} key={m.id}/>);
}

function MastRow(props) {
  const mastProfileClass = ProfileClass.getClassOf(props.mast.profile);
  const profileShortNameClassName = 'mast-property-profile ' + mastProfileClass.className;
  const profileBarClassName = 'mast-profile-bar ' + mastProfileClass.className;
  const profileBarStyle = {
    width: ProfileClass.asRelative(props.mast.profile) * 100 + '%'
  };
  return (
    <tr>
      <td>
        <span className="mast-name">{props.mast.name}</span>
        <span className="mast-property">{props.mast.length}</span>
        <span className="mast-property">{props.mast.diameter}</span>
        <span className="mast-property">{props.mast.year}</span>
        <button
          className={profileShortNameClassName}
          onClick={() => props.comparator.sortProfileFirst(props.mast.profile)}
        >{mastProfileClass.shortName}</button>
        <div className={profileBarClassName} style={profileBarStyle}/>
      </td>
    </tr>
  );
}

class Filter extends React.Component {

  render() {
    const options = this.props.options;
    const state = this.props.state;
    return (
      <table id="mobile-filter"><tbody>
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
          onClear={() => this.clearYearFilter()}
        />
        <FilterGroup
          label="Producer:"
          options={options.namePrefix}
          state={state.namePrefix}
          onChange={e => this.namePrefixChanged(e)}
          onClear={() => this.clearNamePrefixFilter()}
        />
      </tbody></table>
    );
  }

  diameterChanged(event) {
    const diameter = event.target.id;
    this.props.onChange(function(state) {
      state.toggleDiameter(diameter);
    });
  }

  yearChanged(event) {
    const year = parseInt(event.target.id);
    this.props.onChange(function(state) {
      state.toggleYear(year);
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
        onClick={props.onChange}
      />
    )
  );
  const clearButton = props.onClear ?
    <ClearButton onClick={props.onClear} /> :
    undefined;
  return (
    <tr>
      <td className="mobile-filter-label"><label>{props.label}</label></td>
      <td className="mobile-filter-options">{items}</td>
      <td className="mobile-filter-buttons">{clearButton}</td>
    </tr>
  );
}

function FilterGroupOption(props) {
  let className = 'mobile-filter-option';
  if(props.checked)
    className += ' mobile-filter-option-checked';
  return (
    <button className={className} {...props}>{props.id}</button>
  );
}

function ClearButton(props) {
  return (
    <button className="mobile-filter-clear" {...props}>
      <i className="fa fa-times" aria-hidden="true" />
    </button>
  );
}
