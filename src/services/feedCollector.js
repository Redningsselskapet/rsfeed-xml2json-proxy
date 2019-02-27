const feed = require('../api/skoytestasjon')
const parser = require('xml2json')
const imageUrlBase = 'https://www.redningsselskapet.no/content/uploads/2019/02'

const options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: 'value'
}

const mergeRescueboatImageUrl = (rescueboats) => {
  if (Array.isArray(rescueboats)) {
    return rescueboats.map((rescueboat) => {
      return { ...rescueboat, imageUrl: `${imageUrlBase}/RS${rescueboat.rs}.jpg` }
    })
  } else {
    return {...rescueboats, imageUrl: `${imageUrlBase}/RS${rescueboats.rs}.jpg`}
  }
}

const getRescueboats = (url) => {
  return feed(url)
    .then((response) => {
      const data = parser.toJson(response.data, options)
      const rescueboats = data.rescueboats.rescueboat
      return mergeRescueboatImageUrl(rescueboats)
    })
    .catch((err) => {
      console.log(err.message)
    })
}

const getStations = (url) => {
  return feed(url)
    .then((response) => {
      const data = parser.toJson(response.data, options)
      const stations = data.stations.station
      return stations.map((station) => {
        const rescueboatsOnStation = station.rescueboat
        if (station.rescueboat) {
          station.rescueboat = mergeRescueboatImageUrl(rescueboatsOnStation)
        }

        return station
      })
    })
    .catch((err) => {
      console.log(err.message)
    })
}

const getIphoneFeed = (url) => {
  return feed('/iphonefeed')
    .then((response) => {
      const data = parser.toJson(response.data, options)
      const Vessels = data.Markers.Vessel
      const Stations = data.Markers.Station
      return { Vessels, Stations }
    })
    .catch((err) => {
      console.log(err.message)
    })
}

const boatsCollector = {
  rescueboats: null,
  start: async function (interval = 30000) {
    this.rescueboats = await getRescueboats('/getboatsxml')
    setInterval(async () => {
      this.rescueboats = await getRescueboats('/getboatsxml')
    }, interval)
  }
}

const stationsCollector = {
  stations: null,
  start: async function (interval = 30000) {
    this.stations = await getStations('/getstationsxml')
    setInterval(async () => {
      this.stations = await getStations('/getstationsxml')
    }, interval)
  }
}

const iphoneCollector = {
  iphoneFeed: null,
  start: async function (interval = 30000) {
    this.iphoneFeed = await getIphoneFeed('/iphone')
    setInterval(async () => {
      this.iphoneFeed = await getIphoneFeed('/iphone')
    }, interval)
  }
}

const historicalBoatsCollector = {
  rescueboats: null,
  start: async function (interval = 30000) {
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