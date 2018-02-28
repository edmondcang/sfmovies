import urlencode from 'urlencode';
import express from 'express';
import fetch from 'node-fetch';
import db from '../db';
import appconfig from '../appconfig';

const router = express.Router();

db.useDb('sfmovies');
const movies = db.collection('movies');

const cache = {
  movie_names: null,
  locations: {},
};

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

async function askPlace(str) {
  const placeName = urlencode(`${str}, San Francisco`);
  const url = [
    'https://maps.googleapis.com/maps/api',
    `/place/textsearch/json?query=${placeName}`,
    `&key=${appconfig.googleApiKey}`,
  ].join('');
  // console.log(url);
  try {
    const { results } = await fetch(url).then(res => res.json());
    return results[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

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
    const place = await askPlace(list[n].Locations);
    // console.log(place);
    list[n].place = place;
    await f(n - 1);
  };

  await f(list.length - 1);
});

router.get('/onemovie', (req, res) => {
  movies
    .findOne()
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

export default router;
