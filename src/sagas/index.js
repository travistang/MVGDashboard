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
  watchComputeLineSegment,

  watchDestinationAdd,
  watchDestinationRemove,

  checkWatchingDepartureExpire,
} from './mvg'

import {
  storeDestinationWatcher,
  getDestinationWatcher,
  clearDestinationWatcher,
  removeDestinationWatcher,
} from './destination'
import {
  setLocationWatcher,
  setLocationSuccessWatcher,
} from './location'
import {
  getLineWatcher,
  getLineOnGetConnectionSuccessWatcher,
  getLineEncodingWatcher,
} from './line'

const getClock = (state) => state.clock.clock
//reset clock
export function* resetClock() {
  yield put({type: CLOCK_RESET})
}
// elapse a second

export function* tick() {

  let stateClock = yield select(getClock)
  let shouldUpdate = yield select(state => state.clock.shouldUpdate)

  // check watch departure's expration
  yield call(checkWatchingDepartureExpire)
  // for every minute...
  // fetch station (subject to be changed)

  if(stateClock == 0) {
    // only fetch at the beginning of the program
    yield put({type: MVGAction.GET_STATIONS})
    yield put({type: DestinationAction.GET_DESTINATION})
    // fetch line encoding
    yield put({type: MVGAction.GET_LINE_ENCODING})

  }
  try { // guard the departure fetching process
  // update line segment every 5 seconds
    if(stateClock > 0 && stateClock % 5 == 0 && shouldUpdate) {
      yield put({type: MVGAction.COMPUTE_LINE_SEGMENT})
    }
    // TODO: what if get stations failed??

    if(stateClock > 0 && stateClock % 60 == 0 && shouldUpdate) {
      // for all subsequent time...
      yield put({type: MVGAction.GET_DEPARTURES})
      // synchronise destination with server
      yield put({type: DestinationAction.GET_DESTINATION})
      // trigger reload of all connection list
      // let destinations = yield select(state => state.destination.destinations)
      // yield put({type: DestinationAction.GET_DESTINATION_SUCCESS,destinations})
    }
  }
  catch (e) {
    yield put({type: MVGAction.GET_DEPARTURES_FAILED,error: e})
    yield put({type: CLOCK_TICK})
  }
  // tick the clock in all situation
  yield put({type: CLOCK_TICK})
}
export function* mainLoop() {
  while(true) {
    yield delay(1000)
    try {
      yield call(tick)
    } catch(e) {
      console.log('ticking error')
      console.log(e)
      yield mainLoop()
    }

  }
}
export default function* rootSaga(getState) {
  yield [
    // watchers related to common MVG-station-related actions
    watchFetchStations(),
    watchGetDepartures(),
    watchGetConnections(),
    watchFetchStationsSuccess(),
    watchGetDestinationSuccess(),
    watchAddDestinationSuccess(),

    // watchers related to destination info
    storeDestinationWatcher(),
    clearDestinationWatcher(),
    getDestinationWatcher(),
    removeDestinationWatcher(),

    // watchers related to line info
    // explicitly watch for a line info request
    // I'm quite sure that it is needed later
    getLineWatcher(),
      // also get line info once connection fetch is succesful
    getLineOnGetConnectionSuccessWatcher(),
    getLineEncodingWatcher(),

    watchComputeLineSegment(),
    watchDestinationAdd(),
    watchDestinationRemove(),
    // location watcher
    setLocationWatcher(),
    setLocationSuccessWatcher(),
    // of course the main loop for ticking the clock and perform regular update
    mainLoop()
  ]
}
