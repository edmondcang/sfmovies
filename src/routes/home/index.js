/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';

async function action({ fetch, query: { search } }) {
  const { data } = await fetch('/api/movie_names', { method: 'GET' })
    .then(res => res.json())
    .catch(e => console.error(e));
  // console.log(data);
  // console.log(search);
  let locations = [];
  if (search && search.length) {
    const result = await fetch(`/api/locations/${search}`, { method: 'GET' })
      .then(res => res.json())
      .catch(e => console.error(e));
    // console.log(result);
    locations = result.data;
    // console.log(locations);
  }
  return {
    title: 'Home',
    component: <Home keywordList={data} locations={locations} />,
  };
}

export default action;
