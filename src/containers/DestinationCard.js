import { connect } from 'react-redux';
import DestinationCard from '../components/DestinationCard'

function mapStateToProps(state) {
  return {
    currentTime: state.clock.currentTime,
    stationsList: state.mvg.stations,
    destinations: state.destination.destinations,
    connections: state.mvg.connections
  }
}

export default connect(mapStateToProps,null)(DestinationCard)
