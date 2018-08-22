import { connect } from 'react-redux';
import Popup from '../components/Popup'
import * as LocationAction from '../actions/location'
import * as DestinationAction from '../actions/destination'

function mapStateToProps(state) {
  return {
    closestStations: state.mvg.closest_stations,
    stations: state.mvg.stations,
    connections: state.mvg.connections,
    connectionLines: state.mvg.connectionLines,
    destinationDetail: state.destination.destinationDetail
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setLocation: (lat,lng) => dispatch({type: LocationAction.SET_LOCATION,lat,lng}),
    clearDestinationDetail: () => dispatch({type: DestinationAction.SHOW_DESTINATION_DETAIL, destination: null})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Popup)
