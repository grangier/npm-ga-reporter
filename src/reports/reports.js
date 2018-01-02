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
  "ga:newusers",
  "ga:bounces",
  "ga:timeonpage",
  "ga:avgTimeOnPage",
  "ga:pageviewsPerSession",
  "ga:avgSessionDuration",
  "ga:percentNewSessions",
  // "ga:bounceRate",
]

const standardDimensions = [
  "ga:deviceCategory",
]





const _reportComposer = (dateRanges, dims = [], name) => {
  // metrics
  const metrics =_.map(standardMetrics, (metric) =>
    Object.assign({expression: metric, alias: metric})
  )

  standardDimensions.map(e => dims.push(e))
  // dimensions
  const dimensions =  _.map(dims, (dimension) =>
    Object.assign({name: dimension})
  )

  // query
  const query = {
    "viewId": "73631493",
    "pageSize": 10000,
    dateRanges,
    metrics,
    dimensions,
    "orderBys":[
        {"fieldName": "ga:sessions", "sortOrder": "DESCENDING"},
        {"fieldName": "ga:pageviews", "sortOrder": "DESCENDING"}
    ]
  }

  return {
    meta:{
      name:name,
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
  const reports = []
  const dateRanges = _dateRanges()

  // devices
  let query = _reportComposer(
    dateRanges,
    [],
    'v4 devices'
  )
  reports.push(new Report(query))

  // channels
  query = _reportComposer(
    dateRanges,
    ["ga:channelGrouping"],
    "v4 channels"
  )
  reports.push(new Report(query))

  // socialnetworks
  query = _reportComposer(
    dateRanges,
    ["ga:socialNetwork"],
    "v4 socialnetworks"
  )
  reports.push(new Report(query))

  // hostname
  query = _reportComposer(
    dateRanges,
    ["ga:hostname"],
    "v4 hostname"
  )
  reports.push(new Report(query))

  return reports
}
module.exports = {
  request: _requestComposer,
  reports: buildReports()
}
