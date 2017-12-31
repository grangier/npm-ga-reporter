const winston = require("winston-color")

const config = require("./src/config")
const Analytics = require("./src/analytics")
const Publisher = require("./src/publisher")

const _ = require('lodash')

winston.transports.console.level = "info"
winston.transports.console.prettyPrint = true

// runner
const run = function(options = {}) {
  if (options.debug || options.verbose) {
    winston.transports.console.level = "debug"
  }
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
  return Publisher.disk.publish(report)
}

const _runBatch = (reports) => {
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
    winston.error(`[Eeee] `, err)
  })
}

module.exports = { run };
