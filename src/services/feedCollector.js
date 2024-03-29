const feed = require("../api/skoytestasjon");
const parser = require("xml2json");
const getHistorisk = require("../api/historisk");
const imageUrlBase = "https://www.redningsselskapet.no/content/uploads/2019/02";
const statusFeed = require("../api/skoytestatus");

const options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: "value",
};

const mergeRescueboatImageUrl = (rescueboats) => {
  if (Array.isArray(rescueboats)) {
    return rescueboats.map((rescueboat) => {
      return {
        ...rescueboat,
        imageUrl: `${imageUrlBase}/RS${rescueboat.rs}.jpg`,
      };
    });
  } else {
    return {
      ...rescueboats,
      imageUrl: `${imageUrlBase}/RS${rescueboats.rs}.jpg`,
    };
  }
};

const mergeExtendedStates = (rescueboats, states) => {
  states.map((state) => {
    const found = rescueboats.find((rescueboat) => rescueboat.rs == state.RsId);
    if (found) {
      delete state.RsId;
      found.extendedState = state;
    }
  });
  return rescueboats;
};

const getRescueboats = (url) => {
  return feed(url)
    .then((response) => {
      const data = parser.toJson(response.data, options);
      const rescueboats = data.rescueboats.rescueboat;
      return mergeRescueboatImageUrl(rescueboats);
    })
    .then((rescueboats) => {
      return statusFeed().then((response) => {
        return mergeExtendedStates(rescueboats, response.data);
      });
    })
    .catch((err) => {
      console.log(url, err.message);
    });
};

const getStations = (url) => {
  return feed(url)
    .then((response) => {
      const data = parser.toJson(response.data, options);
      const stations = data.stations.station;
      return stations.map((station) => {
        const rescueboatsOnStation = station.rescueboat;
        if (station.rescueboat) {
          station.rescueboat = mergeRescueboatImageUrl(rescueboatsOnStation);
        }

        return station;
      });
    })
    .catch((err) => {
      console.log(url, err.message);
    });
};

const getIphoneFeed = (url) => {
  return feed("/iphonefeed")
    .then((response) => {
      const data = parser.toJson(response.data, options);
      const Vessels = data.Markers.Vessel;
      const Stations = data.Markers.Station;
      return { Vessels, Stations };
    })
    .catch((err) => {
      console.log(url, err.message);
    });
};

const boatsCollector = {
  rescueboats: null,
  start: async function (interval = 30000) {
    this.rescueboats = await getRescueboats("/getboatsxml");
    setInterval(async () => {
      this.rescueboats = await getRescueboats("/getboatsxml");
    }, interval);
  },
};

const stationsCollector = {
  stations: null,
  start: async function (interval = 30000) {
    this.stations = await getStations("/getstationsxml");
    setInterval(async () => {
      this.stations = await getStations("/getstationsxml");
    }, interval);
  },
};

const iphoneCollector = {
  iphoneFeed: null,
  start: async function (interval = 30000) {
    this.iphoneFeed = await getIphoneFeed("/iphone");
    setInterval(async () => {
      this.iphoneFeed = await getIphoneFeed("/iphone");
    }, interval);
  },
};

const historicalBoatsCollector = {
  rescueboats: [],
  start: async function (interval = 10000) {
    const historiskFromJsonFile = (await getHistorisk()).rescueboats.map(
      (historicalRescueboat) => {
        // normalize rs number
        historicalRescueboat.rs = parseInt(historicalRescueboat.rs).toString();
        historicalRescueboat.state = {};
        delete historicalRescueboat.files;
        delete historicalRescueboat.operations;
        delete historicalRescueboat.station;
        delete historicalRescueboat.videos;
        delete historicalRescueboat.technical_images;
        delete historicalRescueboat.action_images;
        delete historicalRescueboat.main_image;
        delete historicalRescueboat.inspector;
        historicalRescueboat.Distriktskontor = undefined;
        return historicalRescueboat;
      }
    );
    const rescueboats = await getRescueboats("/getboatsxml/alltime");
    this.rescueboats = rescueboats.map((boat) => {
      const found = historiskFromJsonFile.find((hboat) => hboat.rs == boat.rs);
      if (!found) {
        return boat;
      }
      return found;
    });
    this.rescueboats.sort((a, b) => parseInt(a.rs) - parseInt(b.rs));

    setInterval(async () => {
      const rescueboats = await getRescueboats("/getboatsxml/alltime");
      this.rescueboats = rescueboats.map((boat) => {
        const found = historiskFromJsonFile.find(
          (hboat) => hboat.rs == boat.rs
        );
        if (!found) {
          return boat;
        }
        return found;
      });
      this.rescueboats.sort((a, b) => parseInt(a.rs) - parseInt(b.rs));
    }, interval + 30000); // Oppdateres mer sjeldent en øvrige tjenester
  },
};

// TODO: if error keep last collected. Add timestamp for collected feed.

module.exports = {
  boatsCollector,
  stationsCollector,
  iphoneCollector,
  historicalBoatsCollector,
};
