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

    it('should add callCount function with initial value of 0 to obj[methodName]', () => {
      austin.spy(testSubject, 'test');

      expect(testSubject.test.callCount()).to.eql(0);
    });

    it('should call original function and increment callCount when spied function is executed', () => {
      testSubject.test = function () {
        return 5;
      };

      austin.spy(testSubject, 'test');

      expect(testSubject.test()).to.eql(5);
      expect(testSubject.test.callCount()).to.eql(1);

      testSubject.test();
      expect(testSubject.test.callCount()).to.eql(2);
    });

    it('should pass params to original function', () => {
      testSubject.test = function (x, y) {
        return x + y;
      };

      austin.spy(testSubject, 'test');

      expect(testSubject.test(1, 3)).to.eql(4);
    });

    it('should reset spy analytics and fake values when reset is called', () => {
      austin.spy(testSubject, 'test');
      testSubject.test.returns(7)
        .withArgs('austin').returns('powers');

      testSubject.test();
      testSubject.test.reset();

      expect(testSubject.test.callCount()).to.eql(0);
      expect(testSubject.test.calls).to.eql([]);
      expect(testSubject.test()).to.eql(undefined);
      expect(testSubject.test('austin')).to.eql(undefined);
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

    it('should add calledWith function to Spied Function', () => {
      austin.spy(testSubject, 'test');

      expect(typeof testSubject.test.calledWith).to.eql('function');
    });

    it('should determine if Spied Function was called with args', () => {
      austin.spy(testSubject, 'test');

      testSubject.test('hi');
      testSubject.test(null, 1, undefined, ['cat']);
      testSubject.test();

      expect(testSubject.test.calledWith('hi')).to.eql(true);
      expect(testSubject.test.calledWith(null, 1, undefined, ['cat'])).to.eql(true);
      expect(testSubject.test.calledWith()).to.eql(true);

      expect(testSubject.test.calledWith('bye')).to.eql(false);
    });

    it('should add returns function to Spied Function', () => {
      austin.spy(testSubject, 'test');

      expect(typeof testSubject.test.returns).to.eql('function');
    });

    it('should return returns value when Spied Function is called', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.returns(7);

      expect(testSubject.test()).to.eql(7);
    });

    it('should override returns value when called again', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.returns(7);
      testSubject.test.returns(5);

      expect(testSubject.test()).to.eql(5);
    });

    it('should throw error when Spied Function is called', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.throws(Error);
      expect(testSubject.test).to.throw(Error);

      testSubject.test.throws(TypeError);
      expect(testSubject.test).to.throw(TypeError);
    });

    it('should throw error with message when Spied Function is called', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.throws(TypeError, 'Expected value to be a string');

      expect(testSubject.test).to.throw(TypeError, /Expected value to be a string/);
    });

    it('should return Spied Function when throws is called', () => {
      austin.spy(testSubject, 'test');

      expect(testSubject.test.throws(Error)).to.eql(testSubject.test);
    });

    it('should add withArgs function to Spied Function', () => {
      austin.spy(testSubject, 'test');

      expect(typeof testSubject.test.withArgs).to.eql('function');
    });

    it('should return object with returns on withArgs call', () => {
      austin.spy(testSubject, 'test');

      expect(typeof testSubject.test.withArgs().returns).to.eql('function');
    });

    it('should return mock value for withArgs->returns setup', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.withArgs('hi').returns('bye');
      testSubject.test.withArgs('austin').returns('powers');

      expect(testSubject.test('hi')).to.eql('bye');
      expect(testSubject.test('austin')).to.eql('powers');
      expect(testSubject.test()).to.eql(undefined);
    });

    it('should throw error for withArgs->throws setup', () => {
      austin.spy(testSubject, 'test');
      testSubject.test
        .withArgs('hi').throws(TypeError)
        .withArgs('hi').throws(SyntaxError)
        .withArgs('austin').throws(TypeError, 'Expected value to be a string');

      function hiTest() {
        testSubject.test('hi');
      }

      function austinTest() {
        testSubject.test('austin');
      }

      expect(hiTest).to.throw(SyntaxError);
      expect(austinTest).to.throw(TypeError, 'Expected value to be a string');
    });

    it('should override withArgs->returns value when called more than once', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.withArgs('hello').returns('bye');
      testSubject.test.withArgs('hello').returns('goodbye');

      expect(testSubject.test('hello')).to.eql('goodbye');
    });

    it('should return Spied Function after setting withArgs->returns', () => {
      austin.spy(testSubject, 'test');

      testSubject.test
        .withArgs('hi').returns('bye')
        .withArgs('austin').returns('powers');

      expect(testSubject.test('hi')).to.eql('bye');
      expect(testSubject.test('austin')).to.eql('powers');
      expect(testSubject.test()).to.eql(undefined);
      expect(testSubject.test('dog')).to.eql(undefined);
    });

    it('should return Spied Function when returns is called', () => {
      austin.spy(testSubject, 'test');

      testSubject.test.returns('bye')
        .withArgs('austin').returns('powers');

      expect(testSubject.test()).to.eql('bye');
      expect(testSubject.test('austin')).to.eql('powers');
      expect(testSubject.test('dog')).to.eql('bye');
    });

    it('should return callCount function on withArgs', () => {
      austin.spy(testSubject, 'test');

      testSubject.test('cat');
      testSubject.test('dog');
      testSubject.test('dog');

      expect(testSubject.test.withArgs().callCount()).to.eql(0);
      expect(testSubject.test.withArgs('cat').callCount()).to.eql(1);
      expect(testSubject.test.withArgs('dog').callCount()).to.eql(2);
      expect(testSubject.test.callCount()).to.eql(3);
    });

    it('should return Spied Function on initial spy for easy chaining', () => {
      austin.spy(testSubject, 'test').returns('dog');

      expect(testSubject.test()).to.eql('dog');
    });

    it('should restore spied function to original function', () => {
      testSubject.test = function () {
        return 1;
      };

      austin.spy(testSubject, 'test');
      testSubject.test.returns(7);
      testSubject.test.restore();

      expect(testSubject.test()).to.eql(1);
      expect(testSubject.test.calls).to.eql(undefined);
      expect(testSubject.test.callCount).to.eql(undefined);
      expect(testSubject.test.restore).to.eql(undefined);
      expect(testSubject.test.returns).to.eql(undefined);
      expect(testSubject.test.withArgs).to.eql(undefined);
    });

    describe('new spy', () => {
      let x;

      beforeEach(() => {
        x = austin.spy();
      });

      it('should be able to set a value to a spy', () => {
        x.returns(7);

        expect(x()).to.eql(7);
        expect(x.callCount()).to.eql(1);
      });

      it('should throw error if trying to restore a new spy', () => {
        expect(x.restore).to.throw(Error, 'Cannot restore a new spy');
      });
    });
  });
});
