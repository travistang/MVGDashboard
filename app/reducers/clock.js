import {CLOCK_TICK,CLOCK_RESET,TOGGLE_UPDATE} from '../actions/clock'

const defaultState = {
  clock: 0,
  currentTime: new Date(),
  shouldUpdate: true,
}
export default function clock(state = defaultState,action) {
  switch(action.type) {
    case CLOCK_RESET:
      return {...state,clock: 0}

    case CLOCK_TICK: // take the clock for one second
      return {
        ...state,
        clock: state.clock + 1,
        currentTime: new Date()
      }
    case TOGGLE_UPDATE:
      return {
        ...state,
        shouldUpdate: !state.shouldUpdate
      }

    default: return state
  }
}
