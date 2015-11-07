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

    /**
     * Update spy analytics and call original function
     *  - Increase callCount by 1
     * @return {*} - return value of original function
     */
    obj[methodName] = function () {
      obj[methodName].callCount++;
      return originalFn();
    };

    /**
     * Number of times obj[methodName] has been executed
     */
    obj[methodName].callCount = 0;

    /**
     * Resets callCount to 0
     */
    obj[methodName].resetCount = function () {
      obj[methodName].callCount = 0;
    };

    /**
     * Transforms Spied Function back to original function
     */
    obj[methodName].restore = function () {
      obj[methodName] = originalFn;
    };
  }
};
