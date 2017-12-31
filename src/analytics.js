// const path = require("path")
// const config = require('./config')
const gaClient = require("./client")
// const GoogleAnalyticsDataProcessor = require("./process-results/ga-data-processor")
 const _ = require('lodash')

const query = (reports) => {
  if (!reports) {
    return Promise.reject(new Error("Analytics.query missing required argument `reports`"))
  }
  const request = builder.request(reports)
  return gaClient.fetchData(request).then(data => {
    return data
    // return GoogleAnalyticsDataProcessor.processData(report, data)
  })
}

const builder = require('./reports/reports')

const _loadReports = () => {
  return builder.reports
}

module.exports = {
  query,
  reports: _loadReports(),
}
