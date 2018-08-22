// @flow

import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClockAction from '../actions/clock'
import * as LocationAction from '../actions/location'
import * as DestinationAction from '../actions/destination'
type Props = {};

function mapStateToProps(state) {
  return {
    ...state.clock,
    ...state.mvg,
    // to check whether user is trying to change his current location or not
    ...state.location,
    destinationDetail: state.destination.destinationDetail
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleUpdate: () => dispatch({type: ClockAction.TOGGLE_UPDATE}),
    toggleChangeLocation: () => dispatch({type: LocationAction.TOGGLE_LOCATION_MODE}),
    clearDestinationDetail: () => dispatch({type: DestinationAction.SHOW_DESTINATION_DETAIL, destination: null})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)
