import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DestinationListComponent from '../components/DestinationList'
import * as DestinationAction from '../actions/destination'
import * as MVGAction from '../actions/mvg'

function mapStateToProps(state) {
  return {
    ...state.destination,
    closest_stations: state.mvg.closest_stations,
    stations: state.mvg.stations, // also give the list of stations to choose from
    connections: state.mvg.connections, // so that the card knows what to render for connections
    currentTime: state.clock.currentTime,
    lines: state.mvg.lines,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getDestinations: () => dispatch({type: DestinationAction.GET_DESTINATION}),
    addDestination: (dest) => dispatch({type: DestinationAction.ADD_DESTINATION,station: dest}),
    clearDestinations: () => dispatch({type: DestinationAction.CLEAR_DESTINATION}),
    removeDestination: (id) => dispatch({type: DestinationAction.REMOVE_DESTINATION,id}),
    refereshRoute: (target_station_id) => dispatch({type: MVGAction.GET_DESTINATION,target_station_id}),
    getLineInfo: (line) => dispatch({type: MVGAction.GET_LINE,line}),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(DestinationListComponent)
