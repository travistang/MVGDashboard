import React from 'react'
import { connect } from 'react-redux';
import Popup from '../components/Popup'
import * as LocationAction from '../actions/location'
function mapStateToProps(state) {
  return {
    closestStations: state.mvg.closest_stations,
    stations: state.mvg.stations
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLocation: (lat,lng) => dispatch({type: LocationAction.SET_LOCATION,lat,lng})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Popup)
