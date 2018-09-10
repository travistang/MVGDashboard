import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select } from "redux-saga/effects"

import * as MVGAction from '../actions/mvg'
import * as DestinationAction from '../actions/destination'
import {getPromise,setPromise,clearPromise,removePromise} from '../api/destination'
import {getDestinations,addDestinations,removeDestinations,clearDestinations} from '../api/destination'
import Api from '../api'

const destinationStorageFieldKey = "destinations"

export function* clearDestination() {
  try {
    yield call(clearPromise,destinationStorageFieldKey)
    yield put({type: DestinationAction.CLEAR_DESTINATION_SUCCESS})
  }catch(e) {
    yield put({type:DestinationAction.CLEAR_DESTINATION_FAILED,error:e})
  }
}

export function* storeDestination(action) {
  let station = action.station
  try {
    let result = yield call(addDestinations,station)
    yield put({type: DestinationAction.ADD_DESTINATION_SUCCESS,station})
  } catch(e) {
    yield put({type: DestinationAction.ADD_DESTINATION_FAILED,error:e})
  }

}


export function* getDestination() {
  try {
    let destinations = yield call(getDestinations)
    // let destinations = yield call(getPromise,destinationStorageFieldKey)
    // if(Object.keys(destinations).length == 0) destinations = []
    yield put({type: DestinationAction.GET_DESTINATION_SUCCESS,destinations})
  }catch(e) {
    yield put({type: DestinationAction.GET_DESTINATION_FAILED,error: e})
  }
}
export function* removeDestination(action) {
  try {
    let destination = action.destination
    let id = destination._id // use the id in mongo
    yield call(removeDestinations,id)

    // yield call(removePromise,destinationStorageFieldKey,id)
    yield put({type: DestinationAction.GET_DESTINATION})
    yield put({type: DestinationAction.REMOVE_DESTINATION_SUCCESS,connection: destination.id})
  } catch(e) {
    yield put({type: DestinationAction.REMOVE_DESTINATION_FAILED,error: e})
  }
}
export function* storeDestinationWatcher() {
  yield takeEvery(DestinationAction.ADD_DESTINATION,storeDestination)
}
export function* getDestinationWatcher() {
  yield takeLatest(DestinationAction.GET_DESTINATION,getDestination)
}

export function* clearDestinationWatcher() {
  yield takeLatest(DestinationAction.CLEAR_DESTINATION,clearDestination)
}

export function* removeDestinationWatcher() {
  yield takeLatest(DestinationAction.REMOVE_DESTINATION,removeDestination)
}
