import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, lifecycle } from 'recompose';
import google, {
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
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        bounds: null,
        // center: {
        //   lat: 41.9, lng: -87.624
        // },
        // markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          // const bounds = refs.map.getBounds();
          // console.log(bounds);
          // this.setState({
          //   bounds,
          //   center: refs.map.getCenter(),
          // })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(
            nextMarkers,
            '0.position',
            this.state.center,
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props => (
  <GoogleMap
    // defaultCenter={props.center}
    ref={props.onMapMounted}
    defaultZoom={props.zoom}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    {props.isMarkerShown && (
      <Marker position={props.center} onClick={props.onMarkerClick} />
    )}
    {props.markers.map(item => {
      // console.log(item.place);
      if (item.place) {
        return (
          <Marker key={item._id} position={item.place.geometry.location} /> // eslint-disable-line no-underscore-dangle
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
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  delayedShowMarker = () => {
    this.timeOutId = setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 2000);
  };

  handleBoundsChanged = () => {
    // if (!this.map) return;
    // const bounds = this.map.getBounds();
    // console.log(bounds);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
    const { onMarkerClick } = this.props;
    if (onMarkerClick) {
      onMarkerClick();
    }
  };

  render() {
    const { center, zoom, markers } = this.props;
    // console.log(markers);
    return (
      <MapComponent
        zoom={zoom}
        center={center}
        markers={markers}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        onBoundsChanged={this.handleBoundsChanged}
      />
    );
  }
}

export default Map;
