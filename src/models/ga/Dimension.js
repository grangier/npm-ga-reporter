const _ = require('lodash')
const utils = require('./utils')

class Choices {

}




class Dimension {
  constructor(obj, value) {
    const {pk, label} = utils.translate(obj.field)
    this.name = pk
    this.label = label
    this.field = name
    this.value = value
  }

  values(data) {
    console.log(
      _.chain(data)
       .map(this.name)
       .values()
       .value()

    )
    return _.chain(data)
      .map(this.name)
      .map('value')
      .values()
      .uniq()
      .value()
  }


  get human() {
    return this.value
  }

}


class Dimensions extends Array {
  get names() {
    return this.map(x => x.name)
  }

  zip(values) {
    return _.zipObject(this.names, values)
  }


}

module.exports = {
  Dimensions,
  Dimension
}
