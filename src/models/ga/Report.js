const _ = require('lodash')

const { Metrics, Metric } = require('./Metric')
const { Dimensions, Dimension } = require('./Dimension')


const _reduceGaResponce = (headers, data) => {
  return _.map(data, (row, index, rows) => {
    // console.log('_reduceGaResponce', row)
    let values
    if(row.metrics) {
      values = row.metrics[0].values
      // console.log('row.metrics', values)
    }

    if(row.values) {
      values = row.values
      // console.log('row.values', values)
    }

    // console.log('headers.metrics', headers.metrics)

    values = headers.metrics.zip(values)
    // console.log('row.valuesvalues', values)

    if(row.dimensions) {
      const dims = headers.dimensions.zip(row.dimensions)
      values = _.merge(dims, values)
    }
    return values
  })
}

const _processGaResponse = (response) => {
  const {columnHeader, data:oData} = response
  const {dimensions, metricHeader} = columnHeader
  const {metricHeaderEntries:metrics} = metricHeader
  const headers = _initHeaders({dimensions, metrics})
  // data
  let data = {}
  const mk = ['rows','minimums', 'maximums', 'totals']
  mk.map((e, i) =>{
    return data[e] = _reduceGaResponce(headers, oData[e])
  })
  return {headers, data}
}


const _initHeaders = (headers) => {
  const {
    dimensions:dims,
    metrics:mtrcs
  } = headers

  const dimensions = new Dimensions()
  dims.map((e, i) =>
    dimensions.push(new Dimension(e)))

  const metrics = new Metrics()
  mtrcs.map((e, i) =>
    metrics.push(new Metric(e)))

  return { dimensions, metrics }
}


class Report {

  constructor(props) {
    this.query = props.query
    this.meta = props.meta
    this.meta['pk'] = _.kebabCase(this.meta.name)
    this.data = props.data || {}
    this.timestamp = props.timestamp || null

    if(props.headers) {
      this.headers = _initHeaders(props.headers)
      // data
      const mk = ['rows','minimums', 'maximums', 'totals']
      const {metrics, dimensions} = props.headers
      mk.map((e, i) =>{

        const items = this.data[e]
        _.map(items, (item, index) =>{

          _.map(metrics, m => {
            this.data[e][index][m.name]= new Metric(m, item[m.name])
          })
          _.map(dimensions, m => {
            this.data[e][index][m.name]= new Dimension(m, item[m.name])
          })
        })


      })
    }


  }

  response(response) {
    const {headers, data} = _processGaResponse(response)
    // const query = this.query
    // const meta = this.meta
    this.headers = headers
    this.data = data
    this.timestamp = new Date()
    return this
    // return new Report({
    //   query,
    //   meta,
    //   headers,
    //   data,
    //   timestamp
    // })
  }

  get filename() {
    const pk  = this.meta.pk
    const viewid = this.query.viewId
    return `${viewid}-${pk}.json`
  }

  get name() {
    return this.meta.name
  }

  get description() {
    return this.meta.description
  }

}


module.exports = Report;
