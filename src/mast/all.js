export default function loadAll() {
    return load([2019,2017,2014,2013,2012,2011]);
}

function load(years) {
  return Promise.all(years.map(y => loadSingle(y)))
    .then(function(dataPerYear) {
      const all = merge(dataPerYear);
      generateIds(all);
      return all;
    });
}

function loadSingle(year) {
  return import('./' + year + '.json')
    .then(function(module) {
      setYear(module.default,year);
      return module.default;
    });
}

function setYear(masts, year) {
  masts.forEach(function(mast) {
    mast.year = year;
  });
}

function merge(dataPerYear) {
  return dataPerYear.reduce(
    (all,yearData) => all.concat(yearData),
    []
  );
}

function generateIds(masts) {
  masts.forEach(function (m,i) { m.id = i; });
}
