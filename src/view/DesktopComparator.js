import React from 'react'

import {ProfileClass} from '../model/MastDataModel.js';

import Filter from './Filter.js';

import './DesktopComparator.css';

export default function DesktopComparator(props) {
  const comparator = props.comparator;
  const filter = comparator.state.filter;
  const filtered = props.comparator.getFiltered();
  return (
    <div id="desktop-comparator">
      <h1 className="app-header">Windsurfing Mast Profile Comparator</h1>
      <Filter
        state={filter.state}
        options={filter.options}
        onChange={c => comparator.filterChanged(c)}
      />
      <table>
        <ComparatorHeader comparator={comparator} />
        <tbody>
          <ComparedMasts model={comparator.state.compared} comparator={comparator}/>
          <ComparatorFooter comparator={comparator}/>
          <SortingHeader comparator={comparator}/>
          <NotComparedMasts
            model={filtered}
            comparator={comparator}
          />
        </tbody>
      </table>
    </div>
  );
}

function ComparatorHeader(props) {
  let comparator = props.comparator;
  let getClassName = (profileClass) => {
    let className = profileClass.className;
    if(comparator.isHighlightedClass(profileClass))
      className += " highlighted";
    return className;
  };
  return (
    <thead>
      <tr>
        <th>Producer</th>
        <th>Year</th>
        <th>Diameter</th>
        <th>Length</th>
        <th colSpan="5" className={getClassName(ProfileClass.HardTop)}>
          <span
            title="Sort hard top first"
            className="clickable"
            onClick={() => comparator.sortProfileFirst(ProfileClass.HardTop.getTypical())}
          >Hard top</span>
        </th>
        <th colSpan="5" className={getClassName(ProfileClass.ConstantCurve)}>
          <span
            title="Sort constant curve first"
            className="clickable"
            onClick={() => comparator.sortProfileFirst(ProfileClass.ConstantCurve.getTypical())}
          >Constant curve</span>
        </th>
        <th colSpan="5" className={getClassName(ProfileClass.FlexTop)}>
          <span
            title="Sort flex top first"
            className="clickable"
            onClick={() => comparator.sortProfileFirst(ProfileClass.FlexTop.getTypical())}
          >Flex Top</span>
        </th>
      </tr>
    </thead>
  );
}

class ComparatorFooter extends React.Component {

  render() {
    return (
      <tr>
        <td
          colSpan="19"
          style={{textAlign: 'left'}}
        >
          { this.props.comparator.isAnyCompared() ?
            this.renderNonEmpty() :
            this.renderEmpty()
          }
        </td>
      </tr>
    );
  }

  renderEmpty() {
    return (
      <span>Use the ✚ icon next to a producer name to add the mast to the comparison.</span>
    );
  }

  renderNonEmpty() {
    return (
      <button 
        onClick={() => this.props.comparator.removeAll()}
      >Remove all compared masts above.</button>
    );
  }
};

class SortingHeader extends React.Component {
  
  render() {
    let comparator = this.props.comparator;
    return (
      <tr>
        <td className="header">Producer
          <span
            title="Sort ascending by producer name"
            className="clickable left-padded"
            onClick={() => comparator.sortByNameAscending()}
          >&#x25b2;</span>
          <span
            title="Sort descending by producer name"
            className="clickable"
            onClick={() => comparator.sortByNameDescending()}
          >&#x25bc;</span>
        </td>
        <td className="header">Year</td>
        <td className="header">Diameter</td>
        <td className="header">Length</td>
        {this.getProfileColumns()}
      </tr>
    );
  }

  getProfileColumns() {
    let comparator = this.props.comparator;
    let columns = Array(15);
    for(let profile = 1; profile <= columns.length; profile++) {
      columns[profile-1] =
        <td {...this.props} key={profile} className={comparator.getProfileClassName(profile)}>
          <span
            title="Sort this profile first"
            className="clickable"
            onClick={() => comparator.sortProfileFirst(profile)}
          >&#x25bc;</span>
        </td>;
    }
    return columns;
  }
};

function ComparedMasts(props) {
  let comparator = props.comparator;
  let buttons = (mast) => [
    <span
      title="Remove from comparison"
      className="clickable"
      key="remove"
      onClick={() => comparator.remove(mast)}
    >✖</span>
  ];
  return props.model.masts
    .map(m => <MastRow {...props} mast={m} buttons={buttons(m)} key={m.id}/>);
}

function NotComparedMasts(props) {
  let comparator = props.comparator;
  let buttons = (mast) => [
    <span
      title="Add to comparison"
      className="clickable"
      key="add"
      onClick={() => comparator.compare(mast)}
    >✚</span>
  ];
  return props.model
    .map((m) => <MastRow {...props} mast={m} buttons={buttons(m)} key={m.id}/>);
}

function MastRow(props) {
  return (
    <tr>
      <td className="mast-name">
        {props.buttons}
        <span className="left-padded">{props.mast.name}</span>
      </td>
      <td>{props.mast.year}</td>
      <td>{props.mast.diameter}</td>
      <td>{props.mast.length}</td>
      <ProfileDataColumns {...props}/>
    </tr>
  );
}

class ProfileDataColumns extends React.Component {

  render() {
    const values = this.calculateColumnValues(this.props.mast['profile']);
    return (
      values.map((v,i) => this.renderColumn(i+1,v))
    );
  }

  renderColumn(profile,value) {
    let comparator = this.props.comparator;
    return (
      <td className={comparator.getProfileClassName(profile)} key={profile}>
        {value ? this.renderClickableMark(() => comparator.sortProfileFirst(profile)) : ''}
      </td>
    );
  }

  renderClickableMark(onClick) {
    return (
      <span
        className="clickable"
        onClick={onClick}
      >●</span>
    );
  }

  calculateColumnValues(profile) {
    var values = new Array(15);
    for(let i=0; i < values.length; i++)
      values[i] = (Math.abs(profile - (i + 1)) <= 1);
    return values;
  }
};
