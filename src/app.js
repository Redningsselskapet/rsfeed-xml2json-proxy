const express = require('express')
const parser = require('xml2json')
const feed = require('./api/skoytestasjon')
const cors = require('cors')
const app = express()

const { boatsCollector, stationsCollector, iphoneCollector, historicalBoatsCollector } = require('./services/feedCollector')

const options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: 'value'
}

app.use(cors())

/* app.get('/iphonefeed/:scope?', (req, res) => {
  feed('/iphonefeed')
    .then(response => {
      const data = parser.toJson(response.data, options)
      const Vessels = data.Markers.Vessel
      const Stations = data.Markers.Station
      res.json({ Vessels, Stations })
    })
    .catch(err => {
      console.log(err.message)
    })
})

app.get('/getboatsxml/:scope?', (req, res) => {
  const scope = req.params.scope
  feed(`/getboatsxml/${scope}`)
    .then(response => {
      const data = parser.toJson(response.data, options)
      const rescueboats = data.rescueboats.rescueboat
      res.json({ rescueboats: rescueboats })
    })
    .catch(err => {
      console.log(err.message)
    })
})

app.get('/getstationsxml', (req, res) => {
  feed(`/getstationsxml`)
    .then(response => {
      const data = parser.toJson(response.data, options)
      const stations = data.stations.station
      res.json({ stations })
    })
    .catch(err => {
      console.log(err.message)
    })
}) */

app.get('/prefetch/getboats', (req, res) => {
  res.json({ rescueboats: boatsCollector.rescueboats })
})

app.get('/prefetch/getstations', (req, res) => {
  res.json({ stations: stationsCollector.stations })
})

app.get('/prefetch/iphone', (req, res) => {
  res.json({ iphoneFeed: iphoneCollector.iphoneFeed })
})

app.get('/prefetch/getboats/alltime', (req, res) => {
  res.json({ rescueboats: historicalBoatsCollector.rescueboats })
})

// midlertidig routes

app.get('/getboatsxml', (req, res) => {
  res.json({ rescueboats: boatsCollector.rescueboats })
})

app.get('/getstationsxml', (req, res) => {
  res.json({ stations: stationsCollector.stations })
})

app.get('/iphone', (req, res) => {
  res.json({ iphoneFeed: iphoneCollector.iphoneFeed })
})

app.get('/getboatsxml/alltime', (req, res) => {
  res.json({ rescueboats: historicalBoatsCollector.rescueboats })
})

// midlertidig routes end

const port = process.env.PORT || 3000
app.listen(port, () => {
  boatsCollector.start(process.env.CollectBoatsInterval)
  stationsCollector.start(process.env.CollectStationsInterval)
  iphoneCollector.start(process.env.CollectIphoneInterval)
  historicalBoatsCollector.start(process.env.CollectHisgtoricalBoatsInterval)
  console.log(`Listening on port ${port}`)
})
