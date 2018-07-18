import { takeLatest,takeEvery,delay } from "redux-saga"
import { call, put,select,all,spawn } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import Api from './mvg'
import {CLOCK_RESET,CLOCK_TICK} from '../actions/clock'
import {watchGetDepartures,watchFetchStations,watchFetchStationsSuccess} from './mvg'

const getClock = (state) => state.clock.clock
//reset clock
export function* resetClock() {
  yield put({type: CLOCK_RESET})
}
// elapse a second

export function* tick() {

  let stateClock = yield select(getClock)
  // for every minute...
  // fetch station (subject to be changed)

  if(stateClock == 0) {
    // only fetch at the beginning of the program
    yield put({type: MVGAction.GET_STATIONS})
  }
  // TODO: what if get stations failed??
  if(stateClock > 0 && stateClock % 60 == 0) {
    // for all subsequent time...
    yield put({type: MVGAction.GET_DEPARTURES})
  }
  // tick the clock in all situation
  yield put({type: CLOCK_TICK})
}
export function* mainLoop() {
  while(true) {
    yield delay(1000)
    yield call(tick)
  }
}
export default function* rootSaga(getState) {
  yield [
    watchFetchStations(),
    watchGetDepartures(),
    watchFetchStationsSuccess(),

    mainLoop()
  ]
}
