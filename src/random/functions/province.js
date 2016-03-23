const cityData = require('../../../data/city.json');
export function province() {
  const prov = this.pickone(cityData.city);
  return prov[1];
}
