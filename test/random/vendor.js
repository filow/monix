const monix = require('../../');
const Random = monix.core.Random;
const assert = require('assert');
const random = new Random();


describe('Random#vendor', () => {
  it('randexp', () => {
    const regs = [/[1-6]/, /<([a-z]\w{0,20})>foo<\1>/, /random stuff: .+/];
    regs.forEach(i => {
      const value = random.randexp(i)();
      assert.equal(typeof value.match(i), 'object');
    });
  });
});
