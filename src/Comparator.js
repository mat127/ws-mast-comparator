import React from 'react'
import Filter, { FilterState } from './Filter.js';
import './Comparator.css';

import loadMastData from './mast/all.js'

class ProfileClass {

  constructor(min,max,className) {
    this.min = min;
    this.max = max;
    this.className = className;
  }

  includes(profile) {
    return profile >= this.min && profile <= this.max;
  }

  getTypical() {
    return (this.min + this.max)/2;
  }

  static HardTop = new ProfileClass(1,5,'hard-top');
  static ConstantCurve = new ProfileClass(6,10,'constant-curve');
  static FlexTop = new ProfileClass(11,15,'flex-top');

  static All = [
    this.HardTop,
    this.ConstantCurve,
    this.FlexTop
  ];

  static getClassOf(profile) {
    return this.All.find(cls => cls.includes(profile));
  }

  static getClassNameOf(profile) {
    const cls = this.getClassOf(profile);
    return cls ? cls.className : undefined;
  }
}

export default class Comparator extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      allMasts: [],
      comparedMasts: [],
      highlightedProfile: undefined,
      filter: new FilterState()
    };
    loadMastData().then(data => {
      this.setState({ allMasts: data });
      return data;
    });
  }

  render() {
    return (
      <div>
        <Filter state={this.state.filter} onChange={c => this.filterChanged(c)}/>
        <table>
          <ComparatorHeader comparator={this} />
          <tbody>
            <ComparedMasts masts={this.state.comparedMasts} comparator={this}/>
            <ComparatorFooter comparator={this}/>
            <SortingHeader comparator={this}/>
            <NotComparedMasts
              masts={this.state.allMasts}
              filter={m => this.state.filter.filter(m)}
              comparator={this}
            />
          </tbody>
        </table>
      </div>
    );
  }

  filterChanged(change) {
    const filter = new FilterState(this.state.filter);
    change(filter);
    this.setState({filter: filter});
  }

  compare(mast) {
    let change = {
      comparedMasts: this.state.comparedMasts.concat([mast])
    };
    change.highlightedProfile = change.comparedMasts[0].profile;
    this.setState(change);
  }

  remove(mast) {
    let change = {
      comparedMasts: this.state.comparedMasts.filter(m => m !== mast)
    };
    change.highlightedProfile = change.comparedMasts.length > 0 ?
      change.comparedMasts[0].profile :
      undefined;
    this.setState(change);
  }

  removeAll() {
    this.setState({
      comparedMasts: [],
      highlightedProfile: undefined
    });
  }

  isCompared(mast) {
    return this.state.comparedMasts.includes(mast);
  }

  isAnyCompared() {
    return this.state.comparedMasts.length > 0;
  }

  isHighlighted(profile) {
    return this.state.highlightedProfile === profile;
  }
    
  isHighlightedClass(profileClass) {
    return profileClass.includes(this.state.highlightedProfile);
  }
    
  sortProfileFirst(profile) {
    const sorted = Array.from(this.state.allMasts)
      .sort((m1,m2) => this.compareToProfile(m1,m2,profile));
    const state = {
      allMasts: sorted
    };
    if(!this.isAnyCompared())
      state.highlightedProfile = profile;
    this.setState(state);
  }

  getProfileClassName(profile) {
    let className = ProfileClass.getClassNameOf(profile);
    if(this.isHighlighted(profile))
      className += " highlighted";
    return className;
  }

  sortByName(sort) {
    const sorted = Array.from(this.state.allMasts)
      .sort(sort);
    const state = {
      allMasts: sorted
    };
    if(!this.isAnyCompared())
      state.highlightedProfile = undefined;
    this.setState(state);
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
        <th>Size</th>
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
  return props.masts
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
  return props.masts
      .filter(m => !comparator.isCompared(m) && props.filter(m))
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
