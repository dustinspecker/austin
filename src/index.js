'use strict'
import deepEqual from 'deep-equal'

/*
 * Adds spy related utilities to obj[methodName] or creates a new Spied Function
 *
 * If obj and methodName are not passed, a Spied Function is created with the
 * same features as a normal Spied Function created from obj and methodName.
 *
 * @throws {TypeError} - if obj is null or undefined
 * @param {Object} [obj] - the object that has the method to spy on
 * @param {*} [methodName] - obj[methodName] must be a function and will be spied on
 * @return {Object} - return Spied Function for easy chaining
 */
const spy = function (...spyArgs) {
  const isNewSpy = !spyArgs.length
  let [obj, methodName] = spyArgs
    , spyReturn = {}
    , withArgsReturns = []

  if (isNewSpy) {
    /* eslint no-param-reassign: 0 */
    obj = {
      spy: () => undefined
    }

    methodName = 'spy'
  }

  if (obj === null || obj === undefined) {
    throw new TypeError('Expected obj to not be null or undefined')
  }

  const originalFn = obj[methodName]

  if (typeof originalFn !== 'function') {
    throw new TypeError('Expected obj[methodName] to be a function')
  }

  // if originalFn looks like a Spied Function, assume it is one and throw an error
  if (originalFn.callCount && originalFn.reset && originalFn.restore) {
    throw new Error('Cannot spy on a Spied Function')
  }

  /**
   * Update spy analytics and call original function
   *  - Push args to calls
   * @return {*} - return value of fake value for args or original function
   */
  obj[methodName] = function (...args) {
    let i

    obj[methodName].calls.push(args)

    for (i = 0; i < withArgsReturns.length; i++) {
      if (deepEqual(withArgsReturns[i].params, args)) {
        if (withArgsReturns[i].Type) {
          throw new withArgsReturns[i].Type(withArgsReturns[i].message)
        }

        return withArgsReturns[i].value
      }
    }

    if (spyReturn.Type) {
      throw new spyReturn.Type(spyReturn.message)
    }

    return spyReturn.value || originalFn(...args)
  }

  const spiedFn = obj[methodName]

  // attach originalFn's properties
  Object.keys(originalFn).forEach(key => {
    spiedFn[key] = originalFn[key]
  })

  /**
   * Number of times obj[methodName] has been executed
   * @return {Number} - number of times called
   */
  spiedFn.callCount = function () {
    return spiedFn.calls.length
  }

  /**
   * Stored parameters of each call to Spied Function
   */
  spiedFn.calls = []

  /**
   * Determine if Spied Function was called with parameters
   * @param {...*} params - list of parameters to test for
   * @return {Boolean} - if Spied function was called with params
   */
  spiedFn.calledWith = function (...params) {
    const calls = spiedFn.calls
    let i

    for (i = 0; i < calls.length; i++) {
      if (deepEqual(calls[i], params, {strict: true})) {
        return true
      }
    }

    return false
  }

  /**
   * Resets spy analytics and fake values
   *  - calls = []
   *  - spyReturn = {}
   *  - withArgsReturns = []
   */
  spiedFn.reset = function () {
    spiedFn.calls = []
    spyReturn = {}
    withArgsReturns = []
  }

  /**
   * Transforms Spied Function back to original function
   * @throws {Error} - if attempting to restore a new spy
   */
  spiedFn.restore = function () {
    if (isNewSpy) {
      throw new Error('Cannot restore a new spy')
    }

    obj[methodName] = originalFn
  }

  /**
   * Set return value of Spied Function to value
   * @param {*} value - a value to return when Spied Function is executed
   * @return {Object} - Spied Function is returned for easy chaining
   */
  spiedFn.returns = function (value) {
    spyReturn.value = value

    return spiedFn
  }

  /**
   * Set error to be thrown when Spied Function is called
   * @param {Error} errorType - type of error to throw
   * @param {String} [message] - message to throw error with
   * @return {Object} - Spied Function is returned for easy chaining
   */
  spiedFn.throws = function (errorType, message) {
    spyReturn.Type = errorType
    spyReturn.message = message

    return spiedFn
  }

  /**
   * Set up spy analytics and returns for Spied Function with specific calls with args
   * @param {...*} params - a list of desired params
   * @return {Object} - object with a returns method for mocking value for specific args
   */
  spiedFn.withArgs = function (...params) {
    return {
      /**
       * Returns number of calls to Spied Function with params
       * @return {Number} - number of calls
       */
      callCount() {
        return spiedFn.calls.reduce(
          (acc, call) => deepEqual(call, params) ? acc + 1 : acc, 0
        )
      },

      /**
       * Setups up fake value returns when Spied Function is called with params
       * Overrides previous fake value if withArgs is called twice with same params
       * @param {*} value - fake value to return
       * @return {Object} - Spied Function is returned for easy chaining
       */
      returns(value) {
        let found = false

        withArgsReturns.forEach(withArgs => {
          if (deepEqual(withArgs.params, params)) {
            withArgs.value = value
            found = true
          }
        })

        if (!found) {
          withArgsReturns.push({params, value})
        }

        return spiedFn
      },

      /**
       * Set error to be thrown when Spied Function is called with params
       * @param {Error} errorType - type of error to throw
       * @param {String} [message] - message to throw error with
       * @return {Object} - Spied Function is returned for easy chaining
       */
      throws(errorType, message) {
        let found = false

        withArgsReturns.forEach(withArgs => {
          if (deepEqual(withArgs.params, params)) {
            withArgs.Type = errorType
            withArgs.message = message
            found = true
          }
        })

        if (!found) {
          withArgsReturns.push({params, Type: errorType, message})
        }

        return spiedFn
      }
    }
  }

  return spiedFn
}

module.exports = {
  spy
}
