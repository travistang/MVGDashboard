import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select,all } from "redux-saga/effects"

import * as MVGAction from '../actions/mvg'
import LineAPI from '../api/line'
import * as Utils from '../utils/utils'

const lineApiInstance = new LineAPI()

export function* fetchEncodings() {
  try {
    let result = yield call(lineApiInstance.fetchLineEncodings.bind(lineApiInstance))
    if(result) yield put({type: MVGAction.GET_LINE_ENCODING_SUCCESS,result})
    else yield put({type: MVGAction.GET_LINE_ENCODING_FAILED})
  } catch(e) {
    console.log('fetching encoding failed with reason')
    console.log(e)
    yield put({type: MVGAction.GET_LINE_ENCODING_FAILED,error:e})
  }
}
export function* getLineInfo(action) {
  try {
    let line = action.line
    let result = yield call(lineApiInstance.getLineInfo.bind(lineApiInstance),line)
    if(!result) yield put({type: MVGAction.GET_LINE_FAILED,line})
    else yield put({
      type: MVGAction.GET_LINE_SUCCESS,
      name: line,
      line: result
    })

  } catch(e) {
    // just for some logging purposes
    console.log(`getLineInfoSaga got error`)
    console.log(e)
    yield put({type: MVGAction.GET_LINE_FAILED,line: action.line,error: e})
  }
}
/*
  handler that gets line info once the connection is successfully fetched.
  the action should have "connection" as a field,
  and this "connection" field should be like
  {
    [id] : [
      {
        departure:...,
        arrival:...,
        ...,
        connectionPartList: {

        }
      }
    ]
  }
*/

export function* getLineInfoOnGetConnectionSuccess(action) {
  let connections = action.connections
  if(!connections) {
    console.log('on get connection success has no connection....')
    console.log(action)
    return
  }
  console.log('getLineInfoOnGetConnectionSuccess connection:')
  console.log(connections)
  // get all the LABELS from the connection part list
  let lines = Utils.flattenList(
    Object.values(connections)[0].map(conn => // one of the connections
        conn.connectionPartList.map(part => part.label) // get labels of all part of connections
    )
  )
  .filter(l => !!l) // no footway or anything undefined please

  lines = [...new Set(lines)] // unique labels only
  yield all( // launch all requests / fetch from cache actions
    lines.map(line =>
      put({type: MVGAction.GET_LINE,line})// trigger GET_LINE action for all of the distinct line
    )
  )

}
export function* getLineWatcher() {
  yield takeEvery(MVGAction.GET_LINE,getLineInfo)
}

// this function watches for the "get connection success" event,
// take all of the lines required within the connection,
// and fetch the station list of this line
export function* getLineOnGetConnectionSuccessWatcher() {
  yield takeEvery(MVGAction.GET_CONNECTION_SUCCESS,getLineInfoOnGetConnectionSuccess)
}

export function* getLineEncodingWatcher() {
  yield takeLatest(MVGAction.GET_LINE_ENCODING,fetchEncodings)
}
