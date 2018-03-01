/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IconClose from 'react-icons/lib/md/close';
import SearchBar from '../../components/SearchBar';
import Map from '../../components/Map';
import s from './Home.css';

const config = {
  zoom: 10,
  center: { lat: 37.7749295, lng: -122.41941550000001 },
};

class Home extends React.Component {
  static propTypes = {
    keywordList: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    keywordList: [],
    locations: [],
  };

  state = {
    isFilmOpen: false,
    // filmTitle: '',
    filmAddress: '',
  };

  setFilmContent = item => {
    // console.log(item);
    this.setState({ filmAddress: item.Locations });
    this.openFilmView();
  };

  openFilmView = () => {
    this.setState({ isFilmOpen: true });
  };

  closeFilmView = () => {
    this.setState({ isFilmOpen: false });
  };

  render() {
    const { isFilmOpen, filmAddress } = this.state;
    const { keywordList, locations } = this.props;

    return (
      <div className={s.root}>
        <div className={s.viewmap}>
          <Map
            {...config}
            markers={locations}
            onMarkerClick={this.setFilmContent}
          />
        </div>
        <div className={s.viewfilm} style={{ bottom: isFilmOpen ? 0 : -100 }}>
          <div className={s.viewfilmContent}>
            {/* <h2>{filmTitle}</h2> */}
            <p>{filmAddress}</p>
          </div>
          <div
            className={s.viewfilmCloseBtn}
            tabIndex="0"
            role="button"
            onKeyUp={null}
            onClick={this.closeFilmView}
          >
            <IconClose />
          </div>
        </div>
        <div className={s.control}>
          <SearchBar
            onSearch={this.setLoading}
            placeholder="search a movie"
            keywordList={keywordList}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
