import * as MVGAction from '../actions/mvg'

const defaultState = {
  stations: [],
  closest_stations: [],
  departures: [],
  error: null,
  // this is the connections object that stores the connections between one station to another
  // the key of it would be the ID OF DESTINATION of the connection
  // value would be the LIST of connections possible to reach this destination
  connections: {},
  // this is the list of lines that may or may not be in the cache,
  // it will only be filled on demand (say the line info is requested)
  lines: {},
  // this is a list of line segment computed
  connectionLines: {},

  // the departure that we are looking at
  watchingDepature: null,
  departureQR: null,
}
export default function mvg(state = defaultState,action) {
  if(action.error) {
    console.log(action)
  }
  switch(action.type) {
    case MVGAction.GET_DEPARTURES_SUCCESS:
      return {...state,departures: action.departures}
    case MVGAction.GET_DEPARTURES_FAILED:
      return {...state,departures: [], error: action.error}
    case MVGAction.GET_CLOSEST_STATIONS:
      return {...state,closest_stations: action.closest_stations}
    case MVGAction.FETCH_STATION_FAILED:
      return {...state,error: action.error}
    case MVGAction.FETCH_STATION_SUCCESS:
      return {...state,stations: action.stations,error: null}
    case MVGAction.SET_CLOSEST_STATION:
      return {...state,closest_stations: action.closest_stations}
    case MVGAction.SET_CURRENT_LOCATION:
      return {...state,lat: action.lat,lng: action.lng}
    case MVGAction.GET_DEPARTURES_SUCCESS:
      return {...state,departures: action.departures,error: null}
    case MVGAction.GET_CONNECTION_FAILED:
      return {...state,error: action.error}
    case MVGAction.REMOVE_CONNECTION:
      return {
        ...state,
        connections: Object.assign(...Object.keys(state.connections)
          .filter(conn => conn != action.connection) // take away the removed connection
          .map(conn => ({[conn]: state.connections[conn]})) // get the unaffected connection back
        )
      }
    case MVGAction.GET_CONNECTION_SUCCESS:
      return {
        ...state,
        error: null,
        connections: {...state.connections,...action.connections}
      }
    case MVGAction.GET_LINE_SUCCESS:
      return {
        ...state,
        error: null,
        lines: {...state.lines,[action.name]:action.line}
      }
    case MVGAction.SET_LINE_SEGMENT_CACHE:
      return {...state,connectionLines: Object.assign({},action.connectionLines)}

    case MVGAction.WATCH_DEPARTURE:
      return {...state, watchingDepature: action.departure}
    case MVGAction.SHOW_QR:
      return {...state,departureQR: action.qr}
    default: return state
  }
}
