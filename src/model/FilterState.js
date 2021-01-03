export class FilterOptions {

  constructor(model) {
    let options = FilterOptions.getOptionsOf(model);
    this.diameter = Array.from(options.diameter);
    this.year = Array.from(options.year)
      .sort((y1,y2) => y2-y1);
    this.namePrefix = Array.from(options.namePrefix)
      .sort();
  }

  static getOptionsOf(model) {
    let options = {
      diameter: new Set(),
      year: new Set(),
      namePrefix: new Set()
    };
    if(model)
      model.forEach(function(mast) {
        options.diameter.add(mast.diameter);
        options.year.add(mast.year);
        options.namePrefix.add(mast.name.substr(0,1).toUpperCase());
      });
    return options;
  }
}

export default class FilterState {

  constructor(source) {
    if(source) {
      this.diameter = new Set(source.diameter);
      this.year = new Set(source.year);
      this.namePrefix = new Set(source.namePrefix);
    }
    else {
      this.diameter = new Set(['SDM', 'RDM']);
      this.year = new Set([2019]);
      this.namePrefix = new Set();
    }
  }

  clone() {
    return new FilterState(this);
  }

  selectDiameter(diameter, selected) {
    if(selected)
      this.diameter.add(diameter);
    else
      this.diameter.delete(diameter);
  }

  selectYear(year, selected) {
    if(selected)
      this.year.add(year);
    else
      this.year.delete(year);
  }

  clearYear() {
    this.year.clear();
  }

  toggleNamePrefix(prefix) {
    if(this.namePrefix.has(prefix))
        this.namePrefix.delete(prefix);
      else
        this.namePrefix.add(prefix);
  }

  clearNamePrefix(prefix) {
    this.namePrefix.clear();
  }

  filter(mast) {
    return this.filterDiameter(mast.diameter)
      && this.filterYear(mast.year)
      && this.filterName(mast.name);
  }

  filterDiameter(diameter) {
    return this.diameter.size > 0 ? this.diameter.has(diameter) : true;
  }

  filterYear(year) {
    return this.year.size > 0 ? this.year.has(year) : true;
  }

  filterName(name) {
    const prefix = name.substr(0,1).toUpperCase();
    return this.namePrefix.size > 0 ? this.namePrefix.has(prefix) : true;
  }
}