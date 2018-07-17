import * as MVGAction from '../actions/mvg'

const defaultState = {
  stations: [],
  closest_stations: [],
  departures: [],
  error: null,
}
export default function mvg(state = defaultState,action) {
  switch(action.type) {
    case MVGAction.GET_DEPARTURES:
      return {...state,departures: action.departures}
    case MVGAction.GET_CLOSEST_STATIONS:
      return {...state,closest_stations: action.closest_stations}
    case MVGAction.FETCH_STATION_FAILED:
      return {...state,error: action.error}
    case MVGAction.FETCH_STATION_SUCCESS:
      return {...state,stations: action.stations,error: null}
    case MVGAction.SET_CLOSEST_STATION:
      return {...state,closest_stations: action.closest_stations}

    default: return state
  }
}
