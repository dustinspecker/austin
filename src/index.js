'use strict';

module.exports = {
  /*
   * Adds spy related utilities to obj[methodName].
   * @throws {TypeError} - if obj is null or undefined
   * @param {Object} obj - the object that has the method to spy on
   * @param {*} methodName - obj[methodName] must be a function and will be spied on
   */
  spy(obj, methodName) {
    let originalFn;

    if (obj === null || obj === undefined) {
      throw new TypeError('Expected obj to not be null or undefined');
    }

    if (typeof obj[methodName] !== 'function') {
      throw new TypeError('Expected obj[methodName] to be a function');
    }

    originalFn = obj[methodName];

    obj[methodName] = function () {
      obj[methodName].callCount++;
      return originalFn();
    };

    obj[methodName].restore = function () {
      obj[methodName] = originalFn;
    };

    obj[methodName].callCount = 0;
  }
};
