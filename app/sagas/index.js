import { takeLatest,takeEvery,delay } from "redux-saga"
import { call, put,select,all,spawn } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import Api from './mvg'
import {CLOCK_RESET,CLOCK_TICK} from '../actions/clock'
import {fetchStation,watchFetchStationsSuccess} from './mvg'

const getClock = (state) => state.clock.clock
//reset clock
export function* resetClock() {
  yield put({type: CLOCK_RESET})
}
// elapse a second

export function* tick() {

  let stateClock = yield select(getClock)
  // for every minute...
  // reset the clock,
  // fetch station (subject to be changed)
  if(stateClock == 0) {
    // only fetch at the beginning of the program
    yield all(
    [
      put({type: MVGAction.GET_STATIONS}),
      // put({type: CLOCK_TICK}),
      // call(resetClock),
    //
    ])
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
    fetchStation(),
    watchFetchStationsSuccess(),
    mainLoop()
  ]
}
