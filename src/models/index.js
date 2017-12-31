const _ = require('lodash')


class Metric {
  constructor(metric) {
    this.name = metric.name
    this.type = metric.type
  }

  cast(value) {
    switch (this.type) {
      case "DATE":
        value = value
        break;
      case "INTEGER":
        value = parseInt(value)
        break;
      case "TIME":
        value = parseFloat(value)
        break;
      case "FLOAT":
        value = parseFloat(value)
        break;
      case "PERCENT":
        value = parseFloat(value)
        break;
      default:
        value = value
    }
    return value
  }
}

class Metrics {
  constructor(props) {
    this.metrics = _.map(props, e => new Metric(e))
    this.cast = this.cast.bind(this)
  }

  map(key) {
    return _.map(this.metrics, key)
  }
  get types() {
    return this.map('type')
  }
  get names() {
    return this.map('name')
  }

  cast(val, i) {
    return this.metrics[i].cast(val)
  }

  values(metrics) {
    const values = _.chain(metrics).map(this.cast).value()
    return _.zipObject(this.names, values)
  }
}


class Dimension {
  constructor(name) {
    this.name = name
  }
}

class Dimensions {
  constructor(props) {
    this.dimensions = _.map(props, e => new Dimension(e))
  }

  get names() {
    return _.map(this.dimensions, 'name')
  }

  values(values) {
    return _.zipObject(this.names, values)
  }

}


class Report {

  constructor(props) {
    this.query = props.query
    this.meta = props.meta
    this.data = {}
  }

  reduce(data) {
    return _.map(data, (row, index, rows) => {
      let values
      if(row.metrics) {
        values = row.metrics[0].values
      }

      if(row.values) {
        values = row.values
      }

      values = this.headers.metrics.values(values)
      
      if(row.dimensions) {
        const dims = this.headers.dimensions.values(row.dimensions)
        values = _.merge(dims, values)
      }
      return values
    })
  }

  response(response) {
    const {columnHeader:cols, data} = response

    // headers
    const {dimensions:colDims, metricHeader} = cols
    const {metricHeaderEntries:colMetrics} = metricHeader
    const dimensions = new Dimensions(colDims)
    const metrics = new Metrics(colMetrics)
    this.headers = { dimensions, metrics }

    // data
    const mk = ['rows','minimums', 'maximums', 'totals']
    mk.map((e, i) =>{
      return this.data[e] = this.reduce(data[e])
    })

    // timestamp
    this.timestamp = new Date()
    return this
  }

  get filename() {
    const name  = _.kebabCase(this.name)
    const viewid = this.query.viewId
    return `${viewid}-${name}.json`
  }

  get name() {
    return this.meta.name
  }

  get description() {
    return this.meta.description
  }


}


module.exports = Report;
