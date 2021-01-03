import React from 'react'

import MastDataModel, {ProfileClass} from './model/MastDataModel.js';
import ComparedMastsModel from './model/ComparedMastsModel.js';
import FilterState, {FilterOptions} from './model/FilterState.js';

import Filter from './Filter.js';

import './Comparator.css';

export default class Comparator extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      allMasts: new MastDataModel(),
      compared: new ComparedMastsModel(),
      highlightedProfile: undefined,
      filter: {
        state: new FilterState(),
        options: new FilterOptions()
      }
    };
    MastDataModel.load()
      .then(model => this.setMastDataModel(model));
  }

  render() {
    let filtered = this.getFiltered();
    return (
      <div id="comparator">
        <Filter
          state={this.state.filter.state}
          options={this.state.filter.options}
          onChange={c => this.filterChanged(c)}
        />
        <table>
          <ComparatorHeader comparator={this} />
          <tbody>
            <ComparedMasts model={this.state.compared} comparator={this}/>
            <ComparatorFooter comparator={this}/>
            <SortingHeader comparator={this}/>
            <NotComparedMasts
              model={filtered}
              comparator={this}
            />
          </tbody>
        </table>
      </div>
    );
  }

  getFiltered() {
    const compared = this.state.compared;
    const filter = this.state.filter.state;
    return this.state.allMasts
      .filter(m => !compared.isCompared(m) && filter.filter(m))
  }

  setMastDataModel(model) {
    this.setState({
      allMasts: model,
      filter: {
        state: this.state.filter.state,
        options: new FilterOptions(model)
      }
    });
  }

  filterChanged(change) {
    const state = this.state.filter.state.clone();
    change(state);
    this.setState({
      filter: {
        state: state,
        options: this.state.filter.options
      }
    });
  }

  compare(mast) {
    let change = {
      compared: this.state.compared.add(mast)
    };
    change.highlightedProfile = change.compared.getProfile();
    this.setState(change);
  }

  remove(mast) {
    let change = {
      compared: this.state.compared.remove(mast)
    };
    change.highlightedProfile = change.compared.getProfile();
    this.setState(change);
  }

  removeAll() {
    this.setState({
      compared: this.state.compared.removeAll(),
      highlightedProfile: undefined
    });
  }

  isCompared(mast) {
    return this.state.compared.isCompared(mast);
  }

  isAnyCompared() {
    return this.state.compared.isAnyCompared();
  }

  isHighlighted(profile) {
    return this.state.highlightedProfile === profile;
  }
    
  isHighlightedClass(profileClass) {
    return profileClass.includes(this.state.highlightedProfile);
  }
    
  getProfileClassName(profile) {
    let className = ProfileClass.getClassNameOf(profile);
    if(this.isHighlighted(profile))
      className += " highlighted";
    return className;
  }

  sortProfileFirst(profile) {
    let state = {
      allMasts: this.state.allMasts.sortProfileFirst(profile)
    };
    if(!this.isAnyCompared())
      state.highlightedProfile = profile;
    this.setState(state);
  }

  sortByName(sort) {
    const state = {
      allMasts: this.state.allMasts.sort(sort)
    };
    if(!this.isAnyCompared())
      state.highlightedProfile = undefined;
    this.setState(state);
  }

  sortByNameDescending() {
    this.sortByName(
      (m1,m2) => -1*MastDataModel.compareMastName(m1,m2)
    );
  }

  sortByNameAscending() {
    this.sortByName(MastDataModel.compareMastName);
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
