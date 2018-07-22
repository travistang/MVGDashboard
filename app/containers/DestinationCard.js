import React from 'react'
import { connect } from 'react-redux';
import DestinationCard from '../components/DestinationCard'

function mapStateToProps(state) {
  return {
    stationsList: state.mvg.stations,
    destinations: state.destination.destinations
  }
}

export default connect(mapStateToProps,null)(DestinationCard)
