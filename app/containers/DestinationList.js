import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DestinationListComponent from '../components/DestinationList'
import * as DestinationAction from '../actions/destination'
import * as MVGAction from '../actions/mvg'
function mapStateToProps(state) {
  return {
    ...state.destination,
<<<<<<< HEAD
    stations: state.mvg.stations // also give the list of stations to choose from
=======
    stations: state.mvg.stations, // also give the list of stations to choose from
>>>>>>> master
    connections: state.mvg.connections // so that the card knows what to render for connections
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getDestinations: () => dispatch({type: DestinationAction.GET_DESTINATION}),
<<<<<<< HEAD
    addDestination: () => dispatch({type: DestinationAction.ADD_DESTINATION}),
=======
    addDestination: (dest) => dispatch({type: DestinationAction.ADD_DESTINATION,station: dest}),
>>>>>>> master
    refereshRoute: (target_station_id) => dispatch({type: MVGAction.GET_DESTINATION,target_station_id})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(DestinationListComponent)
