import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select } from "redux-saga/effects"

import * as LocationAction from '../actions/location'
// TODO: refactor it!
import {getPormise,setPromise} from '../api/destination'


const locationStorageFieldKey = 'location'
export function* getLocation() {
  try {
    let location = yield call(getPromise,locationStorageFieldKey)
    yield put({type: LocationAction.GET_LOCATION_SUCCESS,location})
  } catch(e) {
    yield put({type: LocationAction.GET_LOCATION_FAILED,error:e})
  }
}

export function* setLocation(action) {
  let location = action.location
  try {
    yield call(setPromise,locationStorageFieldKey,location)
    yield put({type: LocationAction.SET_LOCATION_SUCCESS,location})

  } catch(e) {
    yield put({type: LocationAction.SET_LOCATION_FAILED,error: e})
  }
}

export function* getLocationWatcher() {
  yield takeLatest(LocationAction.GET_LOCATION,getLocation)
}

export function* setLocationWatcher() {
  yield takeLatest(LocationAction.SET_LOCATION,setLocation)
}
