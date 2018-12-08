const axios = require('axios')

const feed = axios.create({
  baseURL: 'http://skoytestasjonapi.azurewebsites.net/feed',
  timeOut: process.env.TIMEOUT || 3000
})

module.exports = feed
