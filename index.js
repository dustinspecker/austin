var spy = require('./lib').spy;

var x = {
  test: function () {
    console.log('bye');
  }
};

x.test();

var y = {
  test: function () {
    console.log('y assaf bye');
  }
};

y.test();

spy(x, 'test');

x.test();

spy(y, 'test');

y.test();

console.log('x', x.test.callCount);
console.log('y', y.test.callCount);

x.test.restore();
x.test();

y.test.restore();
y.test();
