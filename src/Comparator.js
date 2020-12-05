import React from 'react'
import './Comparator.css';

import mastData from './mast/2019.json'
mastData.forEach(m => m['year'] = 2019);

function Comparator() {
  return (
    <Table/>
  );
}

export default Comparator
  
function Table() {
  return (
    <table>
      <TableHeader/>
      <TableBody/>
    </table>
  );
}

function TableHeader() {
  return (
    <thead>
      <tr>
        <th rowSpan="2">Name</th>
        <th rowSpan="2">Year</th>
        <th rowSpan="2">Size</th>
        <th rowSpan="2">Length</th>
        <th colSpan="5" className="hard-top">Hard top</th>
        <th colSpan="5" className="constant-curve">Constant curve</th>
        <th colSpan="5" className="flex-top">Flex Top</th>
      </tr>
      <tr>
        <ProfileHeaderColumns className="hard-top"/>
        <ProfileHeaderColumns className="constant-curve"/>
        <ProfileHeaderColumns className="flex-top"/>
      </tr>
    </thead>
  );
}

function ProfileHeaderColumns(props) {
  return (
    Array.of('➀', '➁', '➂', '➃', '➄')
      .map((s) => <td {...props}>{s}</td>)
  );
}
  
function TableBody() {
  return (
    <tbody>
      {mastData.map((m) => <MastRow row={m}/>)}
    </tbody>
  );
}

function MastRow(props) {
  return (
    <tr>
      <td>{props.row['name']}</td>
      <td>{props.row['year']}</td>
      <td>{props.row['size']}</td>
      <td>{props.row['length']}</td>
      <ProfileDataColumns {...props}/>
    </tr>
  );
}

class ProfileDataColumns extends React.Component {

  render() {
    const values = this.calculateColumnValues(this.props.row['profile']);
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

