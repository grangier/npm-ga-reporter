const _ = require('lodash')

const logger = require('./src/logger')
const config = require('./src/config')

const Analytics = require('./src/analytics')
const Publisher = require('./src/publisher')

// runner
const run = function(options = {}) {
  // if (options.debug || options.verbose) {
  //   winston.transports.console.level = "debug"
  // }
  const reports = _getReports(options)
  return _runBatch(reports)
}

// get reports
const _getReports = () => {
  return Analytics.reports
}

const _getReport = (index) => {
  return _getReports()[index]
}

const _formater = (response, index, array) => {
  return _getReport(index).response(response)
}

const _publisher = (report, index, array) => {
  logger.debug(`[${report.name}]` + "Publishing...")
  return Publisher.disk.publish(report)
}

const _runBatch = (reports) => {
  logger.debug("RunBatch...")
  return Analytics.query(reports).then(results => {
    return results
  })
  .then(results => {
    return _.map(results.reports, _formater)
  })
  .then(results => {
    return _.map(results, _publisher)
  })
  .catch(err => {
    logger.error(err)
  })
}

module.exports = { run };
