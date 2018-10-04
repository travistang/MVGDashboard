import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DepartureCard from '../components/DepartureCard'
import {
  WATCH_DEPARTURE
} from '../actions/mvg'
function mapStateToProps(state) {
  return {
    currentTime: state.clock.currentTime,
    closestStations: state.mvg.closest_stations,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    watchDeparture: (departure) => dispatch({
      type: WATCH_DEPARTURE,
      departure
    }),
    removeWatchingDeparture: () => dispatch({
      type: WATCH_DEPARTURE,
      departure: null
    })
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(DepartureCard)
