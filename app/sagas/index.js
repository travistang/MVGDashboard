import { takeLatest,takeEvery,delay } from "redux-saga"
import { call, put,select,all,spawn } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import * as DestinationAction from '../actions/destination'
import Api from './mvg'
import {CLOCK_RESET,CLOCK_TICK} from '../actions/clock'
import {
  watchGetDepartures,
  watchFetchStations,
  watchGetConnections,
  watchFetchStationsSuccess,
  watchGetDestinationSuccess,
  watchAddDestinationSuccess,
} from './mvg'
import {storeDestinationWatcher,getDestinationWatcher,clearDestinationWatcher} from './destination'
const getClock = (state) => state.clock.clock
//reset clock
export function* resetClock() {
  yield put({type: CLOCK_RESET})
}
// elapse a second

export function* tick() {

  let stateClock = yield select(getClock)
  let shouldUpdate = yield select(state => state.clock.shouldUpdate)

  // for every minute...
  // fetch station (subject to be changed)

  if(stateClock == 0) {
    // only fetch at the beginning of the program
    yield put({type: MVGAction.GET_STATIONS})
    yield put({type: DestinationAction.GET_DESTINATION})
  }
  // TODO: what if get stations failed??
  if(stateClock > 0 && stateClock % 60 == 0 && shouldUpdate) {
    // for all subsequent time...
    yield put({type: MVGAction.GET_DEPARTURES})
    // trigger reload of all connection list
    let destinations = yield select(state => state.destination.destinations)
    yield put({type: DestinationAction.GET_DESTINATION_SUCCESS,destinations})
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
    watchGetConnections(),
    watchFetchStationsSuccess(),
    watchGetDestinationSuccess(),
    watchAddDestinationSuccess(),

    storeDestinationWatcher(),
    clearDestinationWatcher(),
    getDestinationWatcher(),

    mainLoop()
  ]
}
