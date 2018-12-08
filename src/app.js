const express = require('express')
const parser = require('xml2json')
const feed = require('./api/skoytestasjon')
const app = express()

const options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: 'value'
}

app.get('/iphonefeed/:scope?', (req, res) => {
  feed('/iphonefeed').then(response => {
    const data = parser.toJson(response.data, options)
    const Vessels = data.Markers.Vessel
    const Stations = data.Markers.Station
    res.json({ Vessels, Stations })
  }).catch(err => {
    console.log(err.message)
  })
})

app.get('/getboatsxml/:scope?', (req, res) => {
  const scope = req.params.scope
  feed(`/getboatsxml/${scope}`).then(response => {
    const data = parser.toJson(response.data, options)
    const rescueboats = data.rescueboats.rescueboat
    res.json({ rescueboats: rescueboats })
  }).catch(err => {
    console.log(err.message)
  })
})

app.get('/getstationsxml', (req, res) => {
  feed(`/getstationsxml`).then(response => {
    const data = parser.toJson(response.data, options)
    const stations = data.stations.station
    res.json({ stations })
  }).catch(err => {
    console.log(err.message)
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
