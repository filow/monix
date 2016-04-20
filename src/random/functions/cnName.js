const randomName = require('chinese-random-name');
export function cnName(params = {}) {
  const { surname = true, name = true } = params;
  let result = '';
  if (surname) {
    result += randomName.surnames.getOne();
  }
  if (name) {
    if (typeof name === 'number') {
      let length = name;
      if (length < 1) length = 1;
      if (length > 3) length = 3;
      result += randomName.names[`get${length}`]();
    } else if (typeof name === 'string') {
      let length = name.length;
      if (length > 3) length = 3;
      result += randomName.names[`get${length}`](name);
    } else {
      result += randomName.names.get();
    }
  }
  return result;
}
