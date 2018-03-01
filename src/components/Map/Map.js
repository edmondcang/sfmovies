import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import appconfig from '../../appconfig';

const URL = [
  'https://maps.googleapis.com/maps/api/js?key=',
  appconfig.googleApiKey,
  '&v=3.exp&libraries=geometry,drawing,places',
].join('');

const MapComponent = compose(
  withProps({
    googleMapURL: URL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    // defaultCenter={props.center}
    ref={props.onMapMounted}
    defaultZoom={props.zoom}
    center={props.center}
  >
    {props.markers.map(item => {
      // console.log(item.place);
      if (item.place) {
        return (
          <Marker
            key={item._id} // eslint-disable-line no-underscore-dangle
            position={item.place.location}
            onClick={props.onMarkerClick(item)}
          />
        );
      }
      return null;
    })}
  </GoogleMap>
));

class Map extends React.PureComponent {
  static propTypes = {
    center: PropTypes.shape().isRequired,
    zoom: PropTypes.number.isRequired,
    onMarkerClick: PropTypes.func,
    markers: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    onMarkerClick: null,
    markers: [],
  };

  state = {
    isMarkerShown: false,
    center: null,
  };

  componentDidMount() {
    this.setCenter(this.props.center);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  setCenter = center => {
    this.setState({ center });
  };

  handleMarkerClick = item => () => {
    this.setCenter(item.place.location);
    const { onMarkerClick } = this.props;
    // console.log(item);
    if (onMarkerClick) {
      onMarkerClick(item);
    }
  };

  render() {
    const { zoom, markers } = this.props;
    // console.log(markers);
    return (
      <MapComponent
        zoom={zoom}
        center={this.state.center}
        markers={markers}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    );
  }
}

export default Map;
