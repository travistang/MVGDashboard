import * as LocationAction from '../actions/location'

const defaultState = {
  isChangingLocation: false,
}


export default function location(state = defaultState,action) {
  switch(action.type) {
    case LocationAction.TOGGLE_LOCATION_MODE:
      return {...state,isChangingLocation: !state.isChangingLocation}
    default:
      return state
  }
}
