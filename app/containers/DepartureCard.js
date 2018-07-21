import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DepartureCard from '../components/DepartureCard'

function mapStateToProps(state) {
  return {
    currentTime: state.clock.currentTime,
    closestStations: state.mvg.closest_stations,
  }
}

export default connect(mapStateToProps,null)(DepartureCard)
