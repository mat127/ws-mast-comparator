import React from 'react'
import './Comparator.css';

import mastData from './mast/2019.json'
mastData.forEach(m => m.year = 2019);

class Comparator extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      comparedMasts: [],
      selectedProfile: undefined
    };
  }

  render() {
    return (
      <div>
        <h1>Windsurfing Mast Comparator</h1>
        <table>
          <ComparatorHeader comparator={this} />
          <tbody>
            <ComparedMasts masts={this.state.comparedMasts} comparator={this}/>
            <ComparatorFooter comparator={this}/>
            <SortingHeader comparator={this}/>
            <NotComparedMasts comparator={this}/>
          </tbody>
        </table>
      </div>
    );
  }

  compare(mast) {
    let change = {
      comparedMasts: this.state.comparedMasts.concat([mast])
    };
    if(this.isAnyCompared())
      this.setState(change);
    else
      this.selectProfile(mast.profile, change);
  }

  remove(mast) {
    let change = {
      comparedMasts: this.state.comparedMasts.filter(m => m !==mast)
    };
    this.setState(change);
  }

  removeAll() {
    this.setState({
      comparedMasts: []
    });
  }

  isCompared(mast) {
    return this.state.comparedMasts.includes(mast);
  }

  isAnyCompared() {
    return this.state.comparedMasts.length > 0;
  }

  selectProfile(profile, stateChange = {}) {
    mastData.sort((m1,m2) => this.compareToProfile(m1,m2,profile));
    stateChange.selectedProfile = profile;
    this.setState(stateChange);
  }

  getProfileClassName(profile) {
    if(profile === this.state.selectedProfile)
      return "selected-profile";
    else if(profile <= 5)
      return "hard-top";
    else if(profile <= 10)
      return "constant-curve";
    else
      return "flex-top";
  }

  sortByName(sort) {
    mastData.sort(sort);
    this.setState({
      selectedProfile: undefined
    });
  }

  sortByNameDescending() {
    this.sortByName((m1,m2) => -1*this.compareMastName(m1,m2));
  }

  sortByNameAscending() {
    this.sortByName(this.compareMastName);
  }

  compareToMast(m1,m2,mast) {
    if(m1 === mast)
      return -1;
    else if(m2 === mast)
      return 1;
    else
      return this.compareToProfile(m1,m2,mast.profile);
  }

  compareToProfile(m1,m2,profile) {
    const dp1 = Math.abs(m1.profile - profile);
    const dp2 = Math.abs(m2.profile - profile);
    const dp = dp1 - dp2;
    if(dp === 0)
      return this.compareMastName(m1,m2);
    else
      return dp;
  }
  
  compareMastName(m1,m2) {
    if(m1.name < m2.name)
      return -1;
    else if(m1.name > m2.name)
      return 1;
    else
      return 0;
  }
};
 
export default Comparator
  
function ComparatorHeader(props) {
  let comparator = props.comparator;
  return (
    <thead>
      <tr>
        <th>Producer</th>
        <th>Year</th>
        <th>Size</th>
        <th>Length</th>
        <th colSpan="5" className="hard-top">
          <button
            title="Sort hard top first"
            className="plain profile-group-header"
            onClick={() => comparator.selectProfile(3)}
          >Hard top</button>
        </th>
        <th colSpan="5" className="constant-curve">
          <button
            title="Sort constant curve first"
            className="plain profile-group-header"
            onClick={() => comparator.selectProfile(8)}
          >Constant curve</button>
        </th>
        <th colSpan="5" className="flex-top">
          <button
            title="Sort flex top first"
            className="plain profile-group-header"
            onClick={() => comparator.selectProfile(13)}
          >Flex Top</button>
        </th>
      </tr>
    </thead>
  );
}

class ComparatorFooter extends React.Component {

  render() {
    return (
      <td
        colspan="19"
        style={{'text-align': 'left'}}
      >
        { this.props.comparator.isAnyCompared() ?
          this.renderNonEmpty() :
          this.renderEmpty()
        }
      </td>
    );
  }

  renderEmpty() {
    return (
      <span>Use the &#9878; icon next to a producer name to add the mast to the comparison.</span>
    );
  }

  renderNonEmpty() {
    return (
      <button
        className="plain hypertext"
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
          <button
            title="Sort ascending by producer name"
            className="plain sort left-padded"
            onClick={() => comparator.sortByNameAscending()}
          >&#x25b2;</button>
          <button
            title="Sort descending by producer name"
            className="plain sort"
            onClick={() => comparator.sortByNameDescending()}
          >&#x25bc;</button>
        </td>
        <td className="header">Year</td>
        <td className="header">Size</td>
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
        <td {...this.props} className={comparator.getProfileClassName(profile)}>
          <button
            title="Sort this profile first"
            className="plain sort"
            onClick={() => comparator.selectProfile(profile)}
          >&#x25bc;</button>
        </td>;
    }
    return columns;
  }
};

function ComparedMasts(props) {
  return props.masts
    .map(m => <MastRow {...props} mast={m} buttons={getComparedButtons(m,props)}/>);
}

function NotComparedMasts(props) {
  let comparator = props.comparator;
  return mastData
      .filter(m => !comparator.isCompared(m))
      .map(m => <MastRow {...props} mast={m} buttons={getNotComparedButtons(m,props)}/>);
}

function getComparedButtons(mast,props) {
  let comparator = props.comparator;
  return [
    <button
      title="Remove from comparison"
      className="plain"
      onClick={() => comparator.remove(mast)}
    >
      &#x274C;
    </button>
  ];
}

function getNotComparedButtons(mast,props) {
  let comparator = props.comparator;
  return [
    <button
      title="Add to comparison"
      className="plain bigger"
      onClick={() => comparator.compare(mast)}
    >
      &#9878;
    </button>
  ];
}

function MastRow(props) {
  return (
    <tr>
      <td className="mast-name">
        {props.buttons}
        {props.mast.name}
      </td>
      <td>{props.mast.year}</td>
      <td>{props.mast.size}</td>
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
      <td className={comparator.getProfileClassName(profile)}>
        {value ? '✔' : ''}
      </td>
    );
  }

  calculateColumnValues(profile) {
    var values = new Array(15);
    for(let i=0; i < values.length; i++)
      values[i] = (Math.abs(profile - (i + 1)) <= 1);
    return values;
  }
};
