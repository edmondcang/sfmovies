// import urlencode from 'urlencode';
import express from 'express';
// import fetch from 'node-fetch';
import NodeGeocoder from 'node-geocoder';
import db from '../db';
import appconfig from '../appconfig';

const router = express.Router();

db.useDb('sfmovies');
const movies = db.collection('movies');

const cache = {
  movie_names: null,
  locations: {},
};

const options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: appconfig.googleApiKey, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Another way to query geoinfo of a given address
// const askPlace = async str => {
//   const placeName = urlencode(`${str}, San Francisco`);
//   const url = [
//     'https://maps.googleapis.com/maps/api',
//     `/place/textsearch/json?query=${placeName}`,
//     `&key=${appconfig.googleApiKey}`,
//   ].join('');
//   console.info(url);
//   try {
//     const { results } = await fetch(url).then(res => res.json());
//     return results[0];
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// };

router.get('/locations/:name', async (req, res) => {
  const { name } = req.params;
  if (cache.locations[name]) {
    res.json({ data: cache.locations[name] });
    return;
  }

  const num = parseInt(name, 10);
  const list = await movies
    .find({ $or: [{ Title: num }, { Title: name }] })
    .project({ Locations: 1 })
    .toArray()
    .catch(error => res.json({ error }));

  const f = async n => {
    if (n < 0) {
      res.json({ data: list });
      cache.locations[name] = list;
      return;
    }
    list[n].Locations += ', San Francisco';
    console.info(list[n]);
    // const place = await askPlace(list[n].Locations);
    const place = await geocoder
      .geocode(list[n].Locations)
      .then(data => data[0])
      .catch(e => console.error(e));
    // console.log(place);
    if (place) {
      place.location = {
        lat: place.latitude,
        lng: place.longitude,
      };
      list[n].place = place;
    }
    await f(n - 1);
  };

  await f(list.length - 1);
});

router.get('/movie_names', (req, res) => {
  if (cache.movie_names !== null) {
    res.json({ data: cache.movie_names });
    return;
  }
  // console.info('Fetch movie name list from DB')
  movies
    .find()
    .map(({ Title }) => String(Title))
    .toArray()
    .then(list => {
      const noDup = [];
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        if (noDup.indexOf(item) < 0) {
          noDup.push(item);
        }
      }
      cache.movie_names = noDup;
      return noDup;
    })
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

export default router;
