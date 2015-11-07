'use strict';
import deepEqual from 'deep-equal';

module.exports = {
  /*
   * Adds spy related utilities to obj[methodName].
   * @throws {TypeError} - if obj is null or undefined
   * @param {Object} obj - the object that has the method to spy on
   * @param {*} methodName - obj[methodName] must be a function and will be spied on
   */
  spy(obj, methodName) {
    let withArgsReturns = []
      , originalFn, returnValue;

    if (obj === null || obj === undefined) {
      throw new TypeError('Expected obj to not be null or undefined');
    }

    originalFn = obj[methodName];

    if (typeof originalFn !== 'function') {
      throw new TypeError('Expected obj[methodName] to be a function');
    }

    // if originalFn looks like a Spied Function, assume it is one and throw an error
    if (originalFn.callCount !== undefined && originalFn.reset && originalFn.restore) {
      throw new Error('Cannot spy on a Spied Function');
    }

    /**
     * Update spy analytics and call original function
     *  - Increase callCount by 1
     *  - Push args to calls
     * @return {*} - return value of fake value for args or original function
     */
    obj[methodName] = function (...args) {
      let i;

      obj[methodName].callCount++;
      obj[methodName].calls.push(args);

      for (i = 0; i < withArgsReturns.length; i++) {
        if (deepEqual(withArgsReturns[i].params, args)) {
          return withArgsReturns[i].value;
        }
      }

      return returnValue || originalFn();
    };

    /**
     * Number of times obj[methodName] has been executed
     */
    obj[methodName].callCount = 0;

    /**
     * Stored parameters of each call to Spied Function
     */
    obj[methodName].calls = [];

    /**
     * Determine if Spied Function was called with parameters
     * @param {*[]} params - list of parameters to test for
     * @return {Boolean} - if Spied function was called with params
     */
    obj[methodName].calledWith = function (params) {
      let calls = obj[methodName].calls
        , i;

      for (i = 0; i < calls.length; i++) {
        if (deepEqual(calls[i], params, {strict: true})) {
          return true;
        }
      }

      return false;
    };

    /**
     * Resets spy analytics
     *  - callCount = 0
     *  - calls = []
     */
    obj[methodName].reset = function () {
      obj[methodName].callCount = 0;
      obj[methodName].calls = [];
    };

    /**
     * Transforms Spied Function back to original function
     */
    obj[methodName].restore = function () {
      obj[methodName] = originalFn;
    };

    /**
     * Set return value of Spied Function to value
     * @param {*} value - a value to return when Spied Function is executed
     */
    obj[methodName].returns = function (value) {
      returnValue = value;
    };

    /**
     * Set up spy analytics and returns for Spied Function with specific calls with args
     * @param {*[]} params - an array of desired params
     * @return {Object} - object with a returns method for mocking value for specific args
     */
    obj[methodName].withArgs = function (params) {
      return {
        /**
         * Setups up fake value returns when Spied Function is called with params
         * @param {*} value - fake value to return
         * @return {Object} - Spied Function is returned for easy chaining
         */
        returns(value) {
          withArgsReturns.push({params, value});

          return obj[methodName];
        }
      };
    };
  }
};
