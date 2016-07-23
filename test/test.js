"use strict"

const jsob = require('../jsob')
const expect = require('chai').expect

function codeThrowsException(funcRunCode) {
  let exceptionWasCaught = null
  try {
    funcRunCode()
    exceptionWasCaught = false
  } catch (ex) {
    exceptionWasCaught = true
  }
  return exceptionWasCaught
}

const subObject = {
  vegetables: {
    green: [
      'kale',
      null,
      'lettuce'
    ],
    red: 'tomato'
  },
  fruits: ['orange', 'apple']
}

const myArr = [
  'one',
  2,
  'three',
  subObject
]

const testObj = { 
  a: 'The letter A',
  arr: myArr,
}


describe('The "nav" function', function() {
  it('iteratively navigates down the hierarchy tree of a JavaScript object, via an array of keywords that is passed to it', function() {
    expect(jsob.nav(testObj, ['arr'])).to.equal(testObj['arr'])
    expect(jsob.nav(testObj, ['a'])).to.equal('The letter A')
    expect(jsob.nav(testObj, ['arr', 0])).to.equal('one')
    expect(jsob.nav(testObj, ['arr', 1])).to.equal(2)
    expect(jsob.nav(testObj, ['arr', 3, 'fruits', 1])).to.equal('apple')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'green', 0])).to.equal('kale')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'green', 1])).to.be.a('null')
  })
  
  it('allows you to pass in just a single value, for navigating just one level down in the tree', function() {
    expect(jsob.nav(testObj, 'a')).to.equal('The letter A')
  })
  it('returns "undefined" when a path is passed in that does not lead to anything.', function() {
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'green', 10])).to.be.an('undefined')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'blue', 10, 'a', 20])).to.be.an('undefined')
    expect(jsob.nav(testObj, ['blahblah', 3, 'vegetables', 'blue', 10, 'a', 20])).to.be.an('undefined')
  })
  it('returns "undefined" when the base object is null or undefined, or if the path is null or undefined', function() {
    expect(jsob.nav(null, 'test')).to.be.an('undefined')
    expect(jsob.nav(undefined, 'test')).to.be.an('undefined')
    expect(jsob.nav(testObj, null)).to.be.an('undefined')
    expect(jsob.nav(testObj, undefined)).to.be.an('undefined')
    expect(jsob.nav(null, null)).to.be.an('undefined')
    expect(jsob.nav(null, undefined)).to.be.an('undefined')
    expect(jsob.nav(undefined, null)).to.be.an('undefined')
    expect(jsob.nav(undefined, undefined)).to.be.an('undefined')
  })
  it('works when the base object is an array, rather than an object', function() {
    expect(jsob.nav(['one', 'two'], 1)).to.equal('two')
    expect(jsob.nav([], 1)).to.be.an('undefined')
    expect(jsob.nav(['one', 'two'], "sdf")).to.be.an('undefined')
    expect(jsob.nav(['one', 'two'], null)).to.be.an('undefined')
    expect(jsob.nav(['one', 'two'], undefined)).to.be.an('undefined')
  })
})

describe('The "set" function', function() {

  it('ensures that the path you specified exists, (creating javascript objects wherever necessary) and sets a value at the location of the termination point to whatever you want, and returns the value that was overwritten (or undefined if nothing was overwritten)', function() {
    const someValue = 'someValue'
    const someNum = 4.7
    const someArray = ["My array"]
    const someObj = {}

    const testPath = ['one', 'two', 'three']

    expect(jsob.set(testObj, 5, 'testing')).to.be.an('undefined')
    expect(jsob.nav(testObj, 5)).to.equal('testing')

    expect(codeThrowsException(function() {
      jsob.set(testObj, [5,4], 'something')
    })).to.be.true
    expect(jsob.nav(testObj, [5,4])).to.be.an('undefined')

    expect(jsob.set(testObj, [6,4], 'something')).to.be.an('undefined')
    expect(jsob.nav(testObj, [6,4])).to.equal('something')
    expect(jsob.nav(testObj, ['6','4'])).to.equal('something')
    expect(jsob.nav(testObj, 6)).to.be.an('object')
    
    const testArr = ['uno', 'dos']
    expect(jsob.set(testArr, 'testMe', 'surfer')).to.be.an('undefined')
    expect(jsob.nav(testArr, 'testMe')).to.equal('surfer')
    expect(jsob.nav(testArr, 0)).to.equal('uno')
    expect(jsob.nav(testArr, '0')).to.equal('uno')
    expect(testArr).to.be.an('array')
    
    expect(jsob.set(testObj, testPath, someValue)).to.be.an('undefined')
    expect(jsob.nav(testObj, testPath)).to.equal(someValue)
    
    expect(jsob.nav(testObj, ['one'])).to.be.an('object')
    expect(jsob.nav(testObj, ['one', 'two'])).to.be.an('object')

    expect(jsob.set(testObj, testPath, someNum)).to.equal(someValue)
    expect(jsob.nav(testObj, testPath)).to.equal(someNum)

    expect(jsob.nav(testObj, ['one'])).to.be.an('object')
    expect(jsob.nav(testObj, ['one', 'two'])).to.be.an('object')
    
    expect(jsob.set(testObj, testPath, someArray)).to.equal(someNum)
    expect(jsob.nav(testObj, testPath)).to.equal(someArray)

    expect(jsob.set(testObj, testPath, someObj)).to.equal(someArray)
    expect(jsob.nav(testObj, testPath)).to.equal(someObj)

    expect(jsob.set(testObj, ['arr', 0], 'newValue')).to.equal('one')
    expect(jsob.nav(testObj, ['arr', 0])).to.equal('newValue')

  })
  it('allows you to pass in just a single value, for navigating just one level down in the tree', function() {
    jsob.set(testObj, 'bumblebee', 'yellow')
    expect(jsob.nav(testObj, ['bumblebee'])).to.equal('yellow')
  })

  it('will keep pre-existing data intact when traversing across it, on the way to the place where a value is supposed to be set', function() {

    jsob.set(testObj, ['arr', 3, 'vegetables', 'orange'], 'pepper')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'orange'])).to.equal('pepper')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'green', 0])).to.equal('kale')

    jsob.set(testObj, ['arr', 5, 'testOne', 'testTwo'], 'myValue')
    expect(jsob.nav(testObj, ['arr', 5, 'testOne', 'testTwo'])).to.equal('myValue')
    expect(jsob.nav(testObj, ['arr', 4])).to.be.an('undefined')
    expect(jsob.nav(testObj, ['arr', 3])).to.be.an('object')
    expect(jsob.nav(testObj, ['arr', 2])).to.equal('three')
    
  })
  
  it('works when the base object is an array, rather than an object', function() {
    const arr = ['one', 'two']
    expect(jsob.set(arr, 0, [null, 'dudette'])).to.equal('one')
    expect(jsob.nav(arr, [0, 1])).to.equal('dudette')
  })
  
  it('Throws an error if the base object is null or undefined', function() {
    expect(codeThrowsException(function() {
      jsob.set(null, [0,'sf'], 'sdf')
    })).to.be.true
    expect(codeThrowsException(function() {
      jsob.set(undefined, [0,'sf'], 'sdf')
    })).to.be.true
    expect(codeThrowsException(function() {
      jsob.set(null, [0], 'sdf')
    })).to.be.true
    expect(codeThrowsException(function() {
      jsob.set(undefined, [0], 'sdf')
    })).to.be.true
    expect(codeThrowsException(function() {
      jsob.set(null, 'sdf')
    })).to.be.true
    expect(codeThrowsException(function() {
      jsob.set(undefined, 'sdf')
    })).to.be.true
  })
})

describe('The "del" function', function() {
  it('deletes the value that exists at the specified path, and returns the value that was deleted', function() {
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'orange'])).to.equal('pepper')
    expect(jsob.del(testObj, ['arr', 3, 'vegetables', 'orange'])).to.equal('pepper')
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables', 'orange'])).to.be.an('undefined')

    expect(jsob.nav(testObj, ['arr', 3, 'vegetables'])).to.be.an('object')
    expect(jsob.nav(testObj, ['arr'])).to.be.an('array')
    expect(jsob.del(testObj, ['arr', 3])).to.equal(subObject)
    expect(jsob.nav(testObj, ['arr', 3, 'vegetables'])).to.be.an('undefined')

  })
  
  it('allows you to pass in just a single value, for navigating just one level down in the tree', function() {
    expect(jsob.nav(testObj, ['arr'])).to.be.an('array')
    expect(jsob.del(testObj, 'arr')).to.equal(myArr)
    expect(jsob.nav(testObj, ['arr'])).to.be.an('undefined')
  })

  it('works when the base object is an array, rather than an object', function() {
    const testArr = ['one', 'two']
    expect(jsob.del(testArr, 0)).to.equal('one')
    expect(jsob.nav(testArr, 0)).to.be.an('undefined')
    expect(jsob.nav(testArr, 1)).to.equal('two')
  })
  
  it('returns "undefined" if you try to delete a path that does not exist', function() {
    expect(jsob.del(testObj, ['mercury', 'venus'])).to.be.an('undefined')
    expect(jsob.nav(testObj, 'a')).to.equal('The letter A') // Make sure the object wasn't destroyed

    expect(jsob.del(testObj, ['a', 'venus'])).to.be.an('undefined')
    expect(jsob.nav(testObj, 'a')).to.equal('The letter A') // Make sure the object wasn't destroyed

    expect(jsob.del(testObj, 'a')).to.equal('The letter A')
    expect(jsob.nav(testObj, 'a')).to.be.an('undefined')

  })
  
  
})