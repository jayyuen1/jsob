"use strict"

const _ = require('underscore')

exports.nav = nav
exports.set = set
exports.del = del

function nullOrUndefined(obj) {
  return (obj === null) || (obj === undefined)
}

function toArray(obj) {
  return _.isArray(obj) ? obj : [obj]
}

function lastInArray(arr) {
  return arr[arr.length - 1]
}

function canNavigateFrom(x) {
  return _.isArray(x) || _.isObject(x)
}

function navTo(obj, path, createPathWhenDoesNotExist) {
  
  return _.reduce(toArray(path), function(memo, pathElement) {
    let nextNode
    if (!canNavigateFrom(memo)) {
      nextNode = undefined
    } else {
      const candidate = memo[pathElement]
      if (nullOrUndefined(candidate) && createPathWhenDoesNotExist) {
        memo[pathElement] = {}
        nextNode = memo[pathElement]
      } else {
        nextNode = candidate
      }
    }
    return nextNode
  }, obj)  
}

function navToParentOf(obj, path, createPathWhenDoesNotExist) {
  const pathArr = toArray(path)
  return (pathArr.length <= 1) ? obj : navTo(obj, pathArr.slice(0, -1), createPathWhenDoesNotExist)
}

function nav(obj, path) {  
  return navTo(obj, path, false)
}

function set(obj, path, value) {
  const pathArr = toArray(path)
  const nodeToSetValueOn = navToParentOf(obj, pathArr, true)
  const lastKeyInPath = lastInArray(pathArr)
  const origValue = nav(nodeToSetValueOn, lastKeyInPath)
  if (!canNavigateFrom(nodeToSetValueOn)) {
    throw new Error("Cannot write a value to the path you specified")
  } else {
    nodeToSetValueOn[lastKeyInPath] = value
    return origValue
  }
}

function del(obj, path) {
  const pathArr = toArray(path)
  const nodeToDeleteFrom = navToParentOf(obj, pathArr, false)
  const lastKeyInPath = lastInArray(pathArr)

  let deletedObj
  if (nullOrUndefined(nodeToDeleteFrom)) {
    deletedObj = nodeToDeleteFrom
  } else {
    deletedObj = nodeToDeleteFrom[lastKeyInPath]
    delete nodeToDeleteFrom[lastKeyInPath]
  }
  return deletedObj
}

