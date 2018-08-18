import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import * as LocationAction from '../actions/location'
import * as DestinationAction from '../actions/destination'
// TODO: refactor it!
import {getPromise,setPromise} from '../api/destination'


const locationStorageFieldKey = 'location'
export function getLocation() {
  return getPromise(locationStorageFieldKey)
}

export function* setLocation(action) {
  let {lat,lng} = action

  try {
    yield call(setPromise,locationStorageFieldKey,{lat,lng})
    yield put({type: LocationAction.SET_LOCATION_SUCCESS,lat,lng})

  } catch(e) {
    yield put({type: LocationAction.SET_LOCATION_FAILED,error: e})
  }
}

export function* refreshLocation() {
  yield put({type: MVGAction.GET_STATIONS})
  let destinations = yield select(state => state.destination.destinations)
  // trigger recomputation of destinations
  yield put({type: DestinationAction.GET_DESTINATION_SUCCESS,destinations})
  // trigger recomputation of line segments...
  yield take(MVGAction.GET_CONNECTION_SUCCESS)
  yield put({type: MVGAction.COMPUTE_LINE_SEGMENT})

}

export function* setLocationWatcher() {
  yield takeLatest(LocationAction.SET_LOCATION,setLocation)
}

export function* setLocationSuccessWatcher() {
  yield takeLatest(LocationAction.SET_LOCATION_SUCCESS,refreshLocation)
}
