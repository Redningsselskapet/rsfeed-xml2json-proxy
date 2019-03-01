const fs = require('fs')
const path = require('path')

const getHistorisk = () => {
  return fs.promises.readFile(path.join(__dirname, '/historisk.json'), 'utf8').then((data) => {
    return JSON.parse(data)
  })
}

module.exports = getHistorisk
