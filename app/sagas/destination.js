import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select } from "redux-saga/effects"

import * as MVGAction from '../actions/mvg'
import * as DestinationAction from '../actions/destination'
import {getPromise,setPromise} from '../api/destination'

import Api from '../api'
const storage = require('electron-json-storage')

const destinationStorageFieldKey = "destinations"


export function* storeDestination(station) {

  try {
    let destinations = yield call(getPromise,destinationStorageFieldKey)
    if(Object.keys(destinations).length == 0) {
      // no destination added
      destinations = []
    }
    destinations.append(station)
    let {key,data} = yield call(setPromise,destinationStorageFieldKey,destinations)
    yield put({type: DestinationAction.ADD_DESTINATION_SUCCESS,station: data})
  } catch(e) {
    yield put({type: DestinationAction.ADD_DESTINATION_FAILED,error:e})
  }

}

export function* getDestination() {
  try {
    let destinations = yield call(getPromise,destinationStorageFieldKey)
    yield put({type: GET_DESTINATION_SUCCESS,destinations})
  }catch(e) {
    yield put({type: DestinationAction.GET_DESTINATION_FAILED,error: e})
  }
}
export function* storeDestinationWatcher() {
  yield takeEvery(DestinationAction.ADD_DESTINATION,storeDestination)
}
export function* getDestinationWatcher() {
  yield takeLatest(DestinationAction.GET_DESTINATION,getDestination)
}
