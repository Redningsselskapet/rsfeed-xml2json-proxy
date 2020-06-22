const axios = require('axios')

const feed = axios.create({
  baseURL: 'http://oppdragsystemettest.azurewebsites.net/api/skoyte/SkoyteStatusAlleSkoyter',
  timeOut: process.env.TIMEOUT || 3000
})

module.exports = feed
