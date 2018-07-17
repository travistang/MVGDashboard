import * as MVGAction from '../actions/mvg'


export default function mvg(state = {},action) {
  switch(action.type) {
    case MVGAction.GET_STATIONS:
    case MVGAction.GET_DEPARTURES:
    case MVGAction.GET_CLOSEST_STATIONS:
    default: return state
  }
}
