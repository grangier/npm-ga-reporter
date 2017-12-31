const google = require("googleapis")
const analytics = google.analyticsreporting("v4")

// test
const sample = require('./sample.json')

const QueryAuthorizer = require("./authorizer")

const fetchData = (reports) => {
  return QueryAuthorizer.authorize(reports)
        .then(reports => {
          return _executeFetchDataRequest(
            reports,
          )}
        )
  }


  const _fakeRequest = (query) => {
    return new Promise((resolve, reject) => {
      resolve(sample)
    })
  }

const _executeFetchDataRequest = (query) => {
  return new Promise((resolve, reject) => {
    _get()(query, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const _get = () => {
  return analytics.reports.batchGet
}

module.exports = { fetchData }
