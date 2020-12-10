import React from 'react'
import './Comparator.css';

import mastData from './mast/2019.json'
mastData.forEach(m => m.year = 2019);

function Comparator() {
  return (
    <Table/>
  );
}

export default Comparator
  
class Table extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedMast: undefined,
      selectedProfile: undefined
    };
  }

  render() {
    return (
      <table>
        <TableHeader
          onNameAscendingClick={() => this.sortByNameAscending()}
          onNameDescendingClick={() => this.sortByNameDescending()}
          onProfileClick={(profile => this.selectProfile(profile))}
          table={this}
        />
        <TableBody
          onNameClick={(mast => this.selectMast(mast))}
          table={this}
        />
      </table>
    );
  }

  selectMast(mast) {
    mastData.sort((m1,m2) => this.compareToMast(m1,m2,mast));
    this.setState({
      selectedMast: mast,
      selectedProfile: mast.profile
    });
  }

  selectProfile(profile) {
    mastData.sort((m1,m2) => this.compareToProfile(m1,m2,profile));
    this.setState({
      selectedMast: undefined,
      selectedProfile: profile
    });
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
      selectedMast: undefined,
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
 
function TableHeader(props) {
  return (
    <thead>
      <tr>
        <th rowSpan="2">
          Name
          <button
            className="sort-button"
            style={{'padding-left': '8px'}}
            onClick={() => props.onNameAscendingClick()}
          >&#x25b4;</button>
          <button
            className="sort-button"
            onClick={() => props.onNameDescendingClick()}
          >&#x25be;</button>
        </th>
        <th rowSpan="2">Year</th>
        <th rowSpan="2">Size</th>
        <th rowSpan="2">Length</th>
        <th colSpan="5" className="hard-top">
          <button
            className="profile-column-header"
            onClick={() => props.onProfileClick(3)}
          >Hard top</button>
        </th>
        <th colSpan="5" className="constant-curve">
          <button
            className="profile-column-header"
            onClick={() => props.onProfileClick(8)}
          >Constant curve</button>
        </th>
        <th colSpan="5" className="flex-top">
          <button
            className="profile-column-header"
            onClick={() => props.onProfileClick(13)}
          >Flex Top</button>
        </th>
      </tr>
      <ProfileHeaderRow {...props}/>
    </thead>
  );
}

function ProfileHeaderRow(props) {
  let columns = Array(15);
  for(let profile = 1; profile <= columns.length; profile++) {
    columns[profile-1] =
        <td {...props} className={props.table.getProfileClassName(profile)}>
          <button
            className="sort-button"
            onClick={() => props.onProfileClick(profile)}
          >&#x25bc;</button>
        </td>;
  }
  return (<tr>{columns}</tr>);
}
  
function TableBody(props) {
  return (
    <tbody>
      {mastData.map((m,i) => <MastRow {...props} mast={m} index={i}/>)}
    </tbody>
  );
}

function MastRow(props) {
  let style = {};
  if(props.mast === props.selectedMast)
    style.className = 'selected-mast';
  return (
    <tr {...style}>
      <td className="mast-name">
        <button
          className="compare-button"
          onClick={() => props.onNameClick(props.mast)}
        >
          &#9878;
        </button>
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
    return (
      <td className={this.props.table.getProfileClassName(profile)}>
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

