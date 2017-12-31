const _ = require('lodash')
const moment = require('moment')
const Report = require('../models')
//
// yesterday
//
const yesterday = moment().startOf('day').subtract(1, 'days')

const standardMetrics = [
  "ga:pageviews",
  "ga:sessions",
  "ga:users",
  // "ga:newusers",
  // "ga:bounces",
  // "ga:timeonpage",
  // "ga:avgTimeOnPage",
  // "ga:pageviewsPerSession",
  // "ga:avgSessionDuration",
  // "ga:percentNewSessions",
  // "ga:bounceRate",
]

const standardDimensions = [
  "ga:deviceCategory",
]





const _reportComposer = (dateRanges) => {
  // metrics
  const metrics =_.map(standardMetrics, (metric) =>
    Object.assign({expression: metric, alias: metric})
  )
  // dimensions
  const dimensions =  _.map(standardDimensions, (dimension) =>
    Object.assign({name: dimension})
  )

  // query
  const query = {
    "viewId": "73631493",
    "pageSize": 10000,
    dateRanges,
    metrics,
    dimensions
  }

  return {
    meta:{
      name:'report name',
      description: 'report description',
    },
    query
  }
}


const _dateRanges = () => {
  return [{
    "startDate": yesterday.format('YYYY-MM-DD'),
    "endDate": yesterday.format('YYYY-MM-DD')
  }]
}


const _requestComposer = (reports) => {
  return {
    "reportRequests": _.map(reports, 'query')
  }
}


const buildReports = () => {
  const dateRanges = _dateRanges()
  const query = _reportComposer(dateRanges)
  return new Report(query)
}

module.exports = {
  request: _requestComposer,
  reports: [buildReports()]
}
