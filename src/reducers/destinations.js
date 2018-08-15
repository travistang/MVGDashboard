import * as DestinationAction from '../actions/destination'
import {getPromise,setPromise} from '../api/destination'
const defaultState = {
  destinations: [],
  error: null,
}

export default function destination(state = defaultState,action) {
  switch(action.type) {
    case DestinationAction.ADD_DESTINATION_SUCCESS:
      return {...state,destinations: [...state.destinations,action.station]}
    case DestinationAction.GET_DESTINATION_SUCCESS:
      return {...state,destinations: action.destinations}
    case DestinationAction.CLEAR_DESTINATION_SUCCESS:
      return {...state,destinations: []}
    case DestinationAction.ADD_DESTINATION_FAILED:
    case DestinationAction.GET_DESTINATION_FAILED:
    case DestinationAction.CLEAR_DESTINATION_FAILED:
      return {...state,error: action.error}
    default:
      // clear error whenever there are add/get requests
      return {...state,error: null}
  }
}
