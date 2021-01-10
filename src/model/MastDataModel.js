export class ProfileClass {

  constructor(min,max,shortName,className) {
    this.min = min;
    this.max = max;
    this.shortName = shortName;
    this.className = className;
  }

  includes(profile) {
    return profile >= this.min && profile <= this.max;
  }

  getTypical() {
    return (this.min + this.max)/2;
  }

  static HardTop = new ProfileClass(1,5,'HT','hard-top');
  static ConstantCurve = new ProfileClass(6,10,'CC','constant-curve');
  static FlexTop = new ProfileClass(11,15,'FT','flex-top');

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

  static asRelative(profile) {
    return profile/ProfileClass.FlexTop.max;
  }
}

export default class MastDataModel {

  constructor(data) {
    this.masts = data ? data : [];
  }

  static load() {
    const years = [2019,2017,2014,2013,2012,2011];
    return Promise.all(
        years.map(y => MastDataModel.loadSingle(y))
      ).then(
        function(dataPerYear) {
          const all = dataPerYear.flat();
          MastDataModel.generateIds(all);
          return new MastDataModel(all);
        }
      );
  }

  static loadSingle(year) {
    return import('../mast/' + year + '.json')
      .then(function(module) {
        MastDataModel.setYear(module.default,year);
        return module.default;
      });
  }

  static setYear(masts, year) {
    masts.forEach(function(mast) {
      mast.year = year;
    });
  }

  static generateIds(masts) {
    masts.forEach(function(m,i) { m.id = i; });
  }

  sort(sort) {
    const sorted = Array.from(this.masts)
      .sort(sort);
    return new MastDataModel(sorted);
  }

  sortProfileFirst(profile) {
    return this.sort(
      (m1,m2) => MastDataModel.compareToProfile(m1,m2,profile)
    );
  }

  static compareToProfile(m1,m2,profile) {
    const dp1 = Math.abs(m1.profile - profile);
    const dp2 = Math.abs(m2.profile - profile);
    const dp = dp1 - dp2;
    if(dp === 0)
      return this.compareMastName(m1,m2);
    else
      return dp;
  }
  
  static compareMastName(m1,m2) {
    if(m1.name < m2.name)
      return -1;
    else if(m1.name > m2.name)
      return 1;
    else
      return 0;
  }

  forEach(func) {
    return this.masts.forEach(func);
  }

  filter(filter) {
    return this.masts.filter(filter);
  }
}