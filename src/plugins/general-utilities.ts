import { IBindingObject } from '~/interfaces/elements'

function BindingObjectGenerator(source: any, displays: any): IBindingObject {

  let newObj: any = {}

  for (let key of Object.keys(source)) {

    var currentDisplay = displays[key]

    // if property is null
    if (!source[key])
      newObj[key] = null

    // if property is string or without display
    else if (typeof source[key] === 'string' && !currentDisplay)
      newObj[key] = source[key]

    // if propperty has function as display
    else if (typeof currentDisplay === 'function')
      newObj[key] = currentDisplay(source[key])

    // if property has a path to corresponding property as display
    else
      newObj[key] = findPropertyBasedOnPath(source[key], currentDisplay)

  }
  return newObj
}

function findPropertyBasedOnPath(obj: object, path: string): any {

  var found: any = obj
  var splittedPath = path.split(".")

  while (splittedPath.length) {

    // Trying to find if there is brackets and getting index from it.
    var matchBrackets = splittedPath[0].match(/(.*?)\[(.*?)\]/)

    if (matchBrackets) { // it's array
      var property = matchBrackets[1]
      var index = parseInt(matchBrackets[2])
      found = found[property][index]
      splittedPath.splice(0, 1)
    }

    else { // it's object
      var property = splittedPath[0]
      found = found[property]
      splittedPath.splice(0, 1)
    }
  }

  return found
}

export { BindingObjectGenerator, findPropertyBasedOnPath }