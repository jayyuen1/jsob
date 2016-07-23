# jsob

A tiny library for navigating through and editing JavaScript/JSON objects, especially via multi-level keys. 


## Installation

`npm install @jayyuen1/jsob`


## Tests

`npm test`


## Usage

There are three functions: 
- **nav** (navigate) - Returns the value that exists at a certain location in a JavaScript/JSON object.
- **set** - Sets a value at a certain location in a JavaScript/JSON object
- **del** (delete) - Deletes a value at a certain location in a JavaScript/JSON object

For all three functions, you specify a location in your JavaScript/JSON object as a sequential list of keys.
  
```javascript
const jsob = require('../jsob')

const obj = {
  zero: 'someString',
  one: {
    two: [
      'uno',
      'due',
      {
        colors: [
          'red',
          'green',
          'blue'
        ]
      }
    ],
    three: 'Hello'
  }
}

// The 'nav' command lets you specify a sequential path of keys to navigate
// through, and returns the value that exists at the end of the path you
// specified.
jsob.nav(obj, 'one') // returns 
jsob.nav(obj, ['one', 'two', 2, 'colors', 1]) // returns 'green'

// If you specify a path that doesn't exist, then you will get back 'undefined'

jsob.nav(obj, ['one', 'five', 'seven', 100]) // returns 'undefined'

// Use the 'set' command to set the value at a certain place in the object.
// If this causes an existing value to get overwritten, then this function 
// will return the value that got overwritten.  Or, if no value got
// overwritten, then the function will return 'undefined'.
jsob.set(obj, ['one', 'two', 2, 'colors', 1], 'purple') // returns 'green'
jsob.nav(obj, ['one', 'two', 2, 'colors', 1]) // returns our new value,
                                              //                     'purple'

// Use the 'del' command to delete a value from your structure.
// The function will return the value that got deleted.

// The following line will return:
//                   [ 'uno', 'due', { colors: [ 'red', 'purple', 'blue' ] } ] 
jsob.del(obj, ['one', 'two'])


// At this point, obj = { zero: 'someString', one: { three: 'Hello' } }


// With 'set', if interim keys do not exist in the path you provide, then
// objects will automatically get created along the way.
jsob.set(obj, ['one', 'four', 'something'], 'myValue') // returns undefined

// At this point,
//   obj = { zero: 'someString',
//            one: { three: 'Hello', four: { something: 'myValue' } } }

```