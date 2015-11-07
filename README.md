# Austin
[![NPM version](https://badge.fury.io/js/austin.svg)](https://badge.fury.io/js/austin) [![Build Status](https://travis-ci.org/dustinspecker/austin.svg)](https://travis-ci.org/dustinspecker/austin) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/austin.svg)](https://coveralls.io/r/dustinspecker/austin?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/austin/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/austin) [![Dependencies](https://david-dm.org/dustinspecker/austin.svg)](https://david-dm.org/dustinspecker/austin/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/austin/dev-status.svg)](https://david-dm.org/dustinspecker/austin/#info=devDependencies&view=table)

> Add the *Powers* of spying to JavaScript tests

## Install
```
npm install --save-dev austin
```

## Usage
```javascript
var austin = require('austin');

var testSubject = {
  testFunction: function () {
    return 5;
  },

  anotherFunction: function () {
    return 'hello';
  }
};

// Inform Austin of the method to spy on...
austin.spy(testSubject, 'testFunction');

// Austin adds spy utilities...
testSubject.testFunction.callCount();
// => 0

// Austin allows executing the function...
testSubject.testFunction('green', 3, {x: ['seven']});
// => 5

// Austin tracks the number of times the spied function was called...
testSubject.testFunction.callCount();
// => 1

// And the parameters passed to each call of the spied function
testSubject.testFunction.calls[0];
// => ['green', 3, {x: ['seven']}]

// And knows if a Spied Function was called with params...
testSubject.testFunction.calledWith(['green', 3, {x: ['seven']}]);
// => true
testSubject.testFunction.calledWith(['blue']);
// => false

// And can intercept the return value of the Spied Function
testSubject.test.returns('a fake value');
testSubject.test();
// => 'a fake value'

// And can intercept the return value of the Spied Function with specific parameters
testSubject.test.withArgs(['austin']).returns('powers');
testSubject.test('austin');
// => 'powers'
testSubject.test.withArgs(['austin']).callCount();
// => 1

// And supports chaining withArgs and returns
testSubject.test.returns('Groovy!')
  .withArgs(['austin']).returns('powers')
  .withArgs(['oooo']).returns('behave');
testSubject.test();
// => 'Groovy!'
testSubject.test('austin');
// => 'powers'
testSubject.test('oooo');
// => 'behave'
testSubject.test('Dr. Evil');
// => 'Groovy!'

// And can chain initial spy call
austin.spy(testSubject, 'anotherFunction').returns('bye')
  .withArgs(['live']).returns('dangerously');
testSubject.anotherFunction();
// => 'bye'
testSubject.anotherFunction('live');
// => 'dangerously'

// Austin can reset spy analytics...
testSubject.testFunction.reset();
testSubject.testFunction.callCount();
// => 0
testSubject.testFunction.calls;
// => []

// When Austin is told to halt spying...
testSubject.testFunction.restore();

// Spy utilities are removed...
testSubject.testFunction.callCount;
// => undefined

// And the function returns to its former self.
testSubject.testFunction();
// => 5
```

## API
### austin.spy(obj, methodName)

Adds spy related utilities to obj[methodName] by transforming the function to a [Spied Function](#spied-function).

Note: returns [Spied Function](#spied-function) for easy chaining with [returns](#spiedfunctionreturnsvalue) and [withArgs](#spiedfunctionwithargsparams).

#### obj

Type: `Object`

An object that has the desired method `methodName` to be spied on.

#### methodName

Type: `*`

Can be any type as long as `obj[methodName]` is a `function`.

## Spied Function

A Spied Function has additional properties and methods to aid testing

### spiedFunction()

Executes the original function, while updating spy analytics such as call count.

### spiedFunction.callCount()

The number of times spiedFunction was executed.

### spiedFunction.calledWith(params)

Returns a `Boolean` if spiedFunction was called with `params`.

#### params

Type: `Array`

Params is an array of any types.

### spiedFunction.calls

An array of parameters passed to each exectuion of Spied Function.

### spiedFunction.reset()

Resets spiedFunction.callCount() to 0 and spiedFunction.calls to [].

### spiedFunction.restore()

Restores the spiedFunction to its original function and removes all spy utilities.

### spiedFunction.returns(value)

When spiedFunction is called, it will return `value` instead of executing the original function.

Note: returns spiedFunction for easy chaining with [withArgs](#spiedfunctionwithargsparams).

#### value

Type: `*`

Any value that is desired to be returned by spiedFunction().

### spiedFunction.withArgs(params)

Returns an object with a [returns](#spiedfunctionreturnsvalue) method to fake return values of calls to spiedFunction with params and [callCount](#spiedfunctioncallcount).

Note: `spiedFunction.withArgs([...]).returns(...)` returns spiedFunction for easy chaining like `spiedFunction.withArgs([...]).returns(...).withArgs([...]).returns(...)`.

#### params

Type: `Array`

An array of any types

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
