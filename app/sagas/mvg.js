// sagas that listens to MVG-api related action
// also launch actual api requests and dispatch action
import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import Api from '../api'

const apiInstance = new Api()
function* fetchStation() {
  let stations = yield call(apiInstance.getAllStations.bind(apiInstance))

  if(stations.error) {
    yield put({type: MVGAction.FETCH_STATION_FAILED,error: error})
  } else {
    yield put({type: MVGAction.FETCH_STATION_SUCCESS, stations})
  }
}
function getGeoLocation() {
  return {
    // Location of Giesing
    lat: 48.11081,
    lng: 11.594633,
  }
  // return new Promise(
  //   (res,rej) => navigator.geolocation.getCurrentPosition(res,rej)
  // )
}
function* onFetchStationSuccess() {
  // get closest station here!
  const getAllStations = state => state.mvg.stations
  const stations = yield select(getAllStations)
  if(stations) {
    let {lat,lng} = yield call(getGeoLocation)
    console.log('got location')
    console.log(lat,lng)
    let closestStations = yield call(apiInstance.getClosestStations,lat,lng,stations)
    console.log('closest stations')
    console.log(closestStations)
    yield put({type: MVGAction.SET_CLOSEST_STATION,closest_stations:closestStations})
  }



  // get your current location


}
export function* watchFetchStations() {
  yield takeEvery(MVGAction.GET_STATIONS,fetchStation)
}


// given a successful fetch of stations, trigger the closest point calculation
export function* watchFetchStationsSuccess() {
  yield takeLatest(MVGAction.FETCH_STATION_SUCCESS,onFetchStationSuccess)
}
