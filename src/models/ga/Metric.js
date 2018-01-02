const _ = require('lodash')
const utils = require('./utils')

class Metric {
  constructor(metric, value) {
    const translated = utils.translate(metric.name)
    this.type = metric.type
    this.field = metric.name
    this.name = translated.pk
    this.label = translated.label
    this.value = value
    // this.cast = this.cast.bind(this)
  }

  get human() {
    return utils.humanize(this.type, this.value)
  }

  cast(value) {
    return utils.cast(this.type, value)
  }
}


class Metrics extends Array {
  get names() {
    return this.map(x => x.name)
  }

  get types() {
    return this.map(x => x.type)
  }

  zip(values) {
    // console.log('----------------------------')
    const casted = this.map((el, i) => {
      const v = values[i]
      const e = el
      const c = el.cast(v)
      // console.log('values[i]', v)
      // console.log('el', el)
      // console.log('el.cast(values[i]', c)
      return c
    })
    // console.log('values', values)
    // console.log('casted', casted)
    return _.zipObject(this.names, casted)
  }
}

module.exports = {
  Metrics,
  Metric
}
