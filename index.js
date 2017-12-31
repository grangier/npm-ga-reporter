const _ = require('lodash')

// logger
const logger = require('./src/logger')
const config = require('./src/config')
const Analytics = require('./src/analytics')
const Publisher = require('./src/publisher')

// get reports
const _getReports = () => {
  return Analytics.reports
}

// get a report
const _getReport = (index) => {
  return _getReports()[index]
}

// format a report
const _formater = (response, index, array) => {
  return _getReport(index).response(response)
}

// publish
const _publisher = (report, index, array) => {
  logger.debug(`[publishing] ${report.name}`)
  return Publisher.disk.publish(report)
}

// runnser
const run = (options = {}) => {
  // get the reports
  const reports = _getReports()

  // logger
  reports.map((r, i) =>{
    logger.debug(`[run] Found: ${r.name}`)
  })

  // run the analytics query
  return Analytics.query(reports).then(results => {
    return results
  })
  // format the reports
  .then(results => {
    return _.map(results.reports, _formater)
  })
  // publish the reports
  .then(reports => {
    return _.map(reports, _publisher)
  })
  .catch(err => {
    logger.error(err)
  })
}

module.exports = { run }
