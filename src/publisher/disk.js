const fs = require("fs")
const path = require("path")
const _ = require('lodash')

const config = require('../config')

const publish = (report) => {
  // data as json
  const jsonData = JSON.stringify(report, null, 2)
  const filePath = path.join(
    config.reports_path, report.filename
  )

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, jsonData, err => {
      if (err) reject(err)
      resolve()
    })
  })
}

module.exports = { publish }
