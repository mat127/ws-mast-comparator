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
        <TableHeader onProfileClick={(profile => this.selectProfile(profile))}/>
        <TableBody
          onNameClick={(mast => this.selectMast(mast))}
          selectedMast={this.state.selectedMast}
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
        <th rowSpan="2">Name</th>
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
      <tr>
        <ProfileHeaderColumns {...props} className="hard-top" baseProfile={0}/>
        <ProfileHeaderColumns {...props} className="constant-curve" baseProfile={5}/>
        <ProfileHeaderColumns {...props} className="flex-top" baseProfile={10}/>
      </tr>
    </thead>
  );
}

function ProfileHeaderColumns(props) {
  return (
    Array.of('➀', '➁', '➂', '➃', '➄')
      .map((s,i) =>
        <td {...props}>
          <button
            className="profile-column-header"
            onClick={() => props.onProfileClick(props.baseProfile+i+1)}
          >{s}</button>
        </td>)
  );
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
          className="mast-name"
          onClick={() => props.onNameClick(props.mast)}
        >
          {props.mast.name}
        </button>
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
      values.map((v,i) => this.renderColumn(v,i))
    );
  }

  renderColumn(value,index) {
    return (
      <td className={this.getColumnClassName(index)}>
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

  getColumnClassName(index) {
    if(index < 5)
      return "hard-top";
    else if(index < 10)
      return 'constant-curve';
    else
      return "flex-top";
  }
};

