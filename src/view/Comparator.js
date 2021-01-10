import React from 'react'
import {
  isMobile
} from "react-device-detect";

import MastDataModel, {ProfileClass} from '../model/MastDataModel.js';
import ComparedMastsModel from '../model/ComparedMastsModel.js';
import FilterState, {FilterOptions} from '../model/FilterState.js';

import DesktopComparator from './DesktopComparator';
import MobileComparator from './MobileComparator';

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
    return isMobile ?
      <MobileComparator comparator={this} /> :
      <DesktopComparator comparator={this} />;
  }

  getFiltered() {
    const compared = this.state.compared;
    const filter = this.state.filter.state;
    return this.state.allMasts
      .filter(m => !compared.isCompared(m) && filter.filter(m))
  }

  showFilter() {
    const state = this.state.filter.state.clone();
    state.visible = true;
    this.setState({
      filter: {
        state: state,
        options: this.state.filter.options
      }
    });
  }

  hideFilter() {
    const state = this.state.filter.state.clone();
    state.visible = false;
    this.setState({
      filter: {
        state: state,
        options: this.state.filter.options
      }
    });
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
