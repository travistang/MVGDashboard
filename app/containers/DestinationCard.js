import React from 'react'
import { connect } from 'react-redux';
import DestinationCard from '../components/DestinationCard'

function mapStateToProps(state) {
  return {
    stationsList: state.mvg.stations,
    destinations: state.destination.destinations,
    connections: state.mvg.connections
  }
}

export default connect(mapStateToProps,null)(DestinationCard)
