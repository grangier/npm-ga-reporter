const numeral = require('numeral')

const mapping = require('./mapping')

const translate = (key) => {
  return mapping[key] || {pk: key, label: key}
}

const humanize = (type, value) => {
  switch (type) {
    case "DATE":
      return value
    case "INTEGER":
      return numeral(value).format('0,0')
    case "TIME":
      return numeral(value).format('00:00:00')
    case "FLOAT":
      return numeral(value).format('0,0')
    case "PERCENT":
      return numeral(value / 100).format('0.0%')
    default:
      return value
  }
}

const cast = (type, value) => {
  // console.log("CAST", type, value)
  switch (type) {
    case "DATE":
      return value
    case "INTEGER":
      return parseInt(value)
    case "TIME":
      return parseFloat(value)
    case "FLOAT":
      return parseFloat(value)
    case "PERCENT":
      return parseFloat(value)
    default:
      return value
  }
  return value
}

module.exports = {
  translate: translate,
  humanize: humanize,
  cast: cast,
}
