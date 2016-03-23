const cityData = require('../../../data/city.json');
export function county() {
  return this.pickone(cityData.county);
}
