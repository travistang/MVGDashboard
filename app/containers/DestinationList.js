import React from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DestinationListComponent from '../components/DestinationList'
import * as DestinationAction from '../actions/destination'

function mapStateToProps(state) {
  return {
    ...state.destination,
    stations: state.mvg.stations // also give the list of stations to choose from
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getDestinations: () => dispatch({type: DestinationAction.GET_DESTINATION}),
    addDestination: (dest) => dispatch({type: DestinationAction.ADD_DESTINATION,station:dest}),
    clearDestinations: () => dispatch({type: DestinationAction.CLEAR_DESTINATION})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(DestinationListComponent)
