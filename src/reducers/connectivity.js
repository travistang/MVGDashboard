import * as ConnectivityActions from '../actions/connectivity'

// the state concerning connectivity to the endpoints
// if its true it means the connection to the service is ok
// otherwise its set to false
const defaultState = {
  mvg_status: true,
  mvv_status: true,
  backend_status: true,
  proxy_status: true
}

export default function connectivityReducer(state = defaultState, action) {
  switch(action.type) {
    case ConnectivityActions.SET_MVG_CONNECTIVITY_FLAG:
      return {...state, mvg_status: action.ok}
    case ConnectivityActions.SET_MVV_CONNECTIVITY_FLAG:
      return {...state, mvv_status: action.ok}
    case ConnectivityActions.SET_BACKEND_CONNECTIVITY_FLAG:
      return {...state, backend_status: action.ok}
    case ConnectivityActions.SET_PROXY_CONNECTIVITY_FLAG:
      return {...state, proxy_status: action.ok}
      
    default: return state
  }
}
