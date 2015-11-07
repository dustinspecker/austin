/* global describe, beforeEach, it */
'use strict';
import austin from '../lib/';
import {expect} from 'chai';

describe('austin', () => {
  describe('spy', () => {
    let testSubject;

    beforeEach(() => {
      testSubject = {
        test() {}
      };
    });

    it('should throw TypeError if obj is null or undefined', () => {
      function nullTest() {
        austin.spy(null);
      }

      function undefinedTest() {
        austin.spy(undefined);
      }

      expect(nullTest).to.throw(TypeError, /Expected obj to not be null or undefined/);
      expect(undefinedTest).to.throw(TypeError, /Expected obj to not be null or undefined/);
    });

    it('should throw TypeError if obj[methodName] is not a function', () => {
      function test() {
        testSubject.id = '1';

        austin.spy(testSubject, 'id');
      }

      expect(test).to.throw(TypeError, /Expected obj\[methodName\] to be a function/);
    });

    it('should throw Error if spy is called on a Spied Function', () => {
      function test() {
        austin.spy(testSubject, 'test');
      }

      austin.spy(testSubject, 'test');

      expect(test).to.throw(Error, /Cannot spy on a Spied Function/);
    });

    it('should add callCount property initialized to 0 to obj[methodName]', () => {
      austin.spy(testSubject, 'test');

      expect(testSubject.test.callCount).to.eql(0);
    });

    it('should call original function and increment callCount when spied function is executed', () => {
      testSubject.test = function () {
        return 5;
      };

      austin.spy(testSubject, 'test');

      expect(testSubject.test()).to.eql(5);
      expect(testSubject.test.callCount).to.eql(1);

      testSubject.test();
      expect(testSubject.test.callCount).to.eql(2);
    });

    it('should reset callCount to 0 when resetCount is called', () => {
      austin.spy(testSubject, 'test');
      testSubject.test();
      testSubject.test.resetCount();

      expect(testSubject.test.callCount).to.eql(0);
    });

    it('should add restore function to obj[methodName]', () => {
      austin.spy(testSubject, 'test');

      expect(typeof testSubject.test.restore).to.eql('function');
    });

    it('should add empty calls list to Spied Function', () => {
      austin.spy(testSubject, 'test');

      expect(testSubject.test.calls).to.eql([]);
    });

    it('should store parameters passed to Spied Function', () => {
      austin.spy(testSubject, 'test');

      testSubject.test('hi');
      testSubject.test(null, 1, {
        x: {
          y: 'hi'
        }
      });
      testSubject.test();

      expect(testSubject.test.calls[0]).to.eql(['hi']);
      expect(testSubject.test.calls[1]).to.eql([null, 1, {
        x: {
          y: 'hi'
        }
      }]);
      expect(testSubject.test.calls[2]).to.eql([]);
    });

    it('should restore spied function to original function', () => {
      testSubject.test = function () {
        return 1;
      };

      austin.spy(testSubject, 'test');
      testSubject.test.restore();

      expect(testSubject.test()).to.eql(1);
      expect(typeof testSubject.test.calls).to.eql('undefined');
      expect(typeof testSubject.test.callCount).to.eql('undefined');
      expect(typeof testSubject.test.restore).to.eql('undefined');
    });
  });
});
