const feed = require('../api/skoytestasjon')
const parser = require('xml2json')

const options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: 'value'
}

const getRescueboats = url => {
  return feed(url)
    .then(response => {
      const data = parser.toJson(response.data, options)
      return data.rescueboats.rescueboat
    })
    .catch(err => {
      console.log(err.message)
    })
}

const getStations = url => {
  return feed(url)
    .then(response => {
      const data = parser.toJson(response.data, options)
      return data.stations.station
    })
    .catch(err => {
      console.log(err.message)
    })
}

const getIphoneFeed = url => {
  return feed('/iphonefeed')
    .then(response => {
      const data = parser.toJson(response.data, options)
      const Vessels = data.Markers.Vessel
      const Stations = data.Markers.Station
      return { Vessels, Stations }
    })
    .catch(err => {
      console.log(err.message)
    })
}

const boatsCollector = {
  rescueboats: null,
  start: async function(interval = 30000) {
    this.rescueboats = await getRescueboats('/getboatsxml')
    setInterval(async () => {
      this.rescueboats = await getRescueboats('/getboatsxml')
    }, interval)
  }
}

const stationsCollector = {
  stations: null,
  start: async function(interval = 30000) {
    this.stations = await getStations('/getstationsxml')
    setInterval(async () => {
      this.stations = await getStations('/getstationsxml')
    }, interval)
  }
}

const iphoneCollector = {
  iphoneFeed: null,
  start: async function(interval = 30000) {
    this.iphoneFeed = await getIphoneFeed('/iphone')
    setInterval(async () => {
      this.iphoneFeed = await getIphoneFeed('/iphone')
    }, interval)
  }
}

const historicalBoatsCollector = {
  rescueboats: null,
  start: async function(interval = 30000) {
    this.rescueboats = await getRescueboats('/getboatsxml/alltime')
    setInterval(async () => {
      this.rescueboats = await getRescueboats('/getboatsxml/alltime')
    }, interval)
  }
}

// TODO: if error keep last collected. Add timestamp for collected feed.

module.exports = {
  boatsCollector,
  stationsCollector,
  iphoneCollector,
  historicalBoatsCollector
}
