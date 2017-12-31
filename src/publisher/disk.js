const _ = require('lodash')
const fs = require("fs")
const path = require("path")

const logger = require('../logger')
const config = require('../config')

const publish = (report) => {
  // data as json
  const jsonData = JSON.stringify(report, null, 2)
  const filePath = path.join(
    config.reports_path, report.filename
  )

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, jsonData, err => {
      if (err) {
        logger.error(`[published] ${report.name} to ${filePath}`)
        reject(err)
      }
      logger.debug(`[published] ${report.name} to ${filePath}`)
      resolve()
    })
  })
}

module.exports = { publish }
