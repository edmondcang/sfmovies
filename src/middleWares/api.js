import express from 'express';
import db from '../db';

const router = express.Router();

db.useDb('sfmovies');
const movies = db.collection('movies');

const cache = {
  movie_names: null,
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

router.get('/onemovie', (req, res) => {
  movies
    .findOne()
    .then(data => res.json({ data }))
    .catch(error => res.json({ error }));
});

export default router;
