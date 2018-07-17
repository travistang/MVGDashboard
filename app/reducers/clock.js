import {CLOCK_TICK,CLOCK_RESET} from '../actions/clock'

const defaultState = {
  clock: 0,
  currentTime: new Date()
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

    default: return state
  }
}
