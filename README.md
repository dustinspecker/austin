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
  }
};

// Inform Austin of the method to spy on...
austin.spy(testSubject, 'testFunction');

// Austin adds spy utilities...
testSubject.testFunction.callCount;
// => 0

// Austin allows executing the function...
testSubject.testFunction('green', 3, {x: ['seven']});
// => 5

// Austin tracks the number of times the spied function was called...
testSubject.testFunction.callCount;
// => 1

// And the parameters passed to each call of the spied function
testSubject.testFunction.calls[0];
// => ['green', 3, {x: ['seven']}]

// Austin can reset spy analytics...
testSubject.testFunction.resetCount();
testSubject.testFunction.callCount;
// => 0

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

### spiedFunction.callCount

The number of times spiedFunction was executed.

### spiedFunction.calls

An array of parameters passed to each exectuion of Spied Function.

### spiedFunction.resetCount()

Resets spiedFunction.callCount to 0.

### spiedFunction.restore()

Restores the spiedFunction to its original function and removes all spy utilities.

## LICENSE
MIT © [Dustin Specker](https://github.com/dustinspecker)
