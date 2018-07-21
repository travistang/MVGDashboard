// sagas that listens to MVG-api related action
// also launch actual api requests and dispatch action
import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select,all } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import Api from '../api'
import * as Utils from '../utils/utils'
const apiInstance = new Api()
export function* fetchStation() {
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
    yield put({type: MVGAction.SET_CURRENT_LOCATION,lat,lng})
    let closestStations = yield call(apiInstance.getClosestStations,lat,lng,stations)
    yield put({type: MVGAction.SET_CLOSEST_STATION,closest_stations:closestStations})
    yield put({type: MVGAction.GET_DEPARTURES})
  }
}

function* onGetDepartures() {
  const getClosestStationsFromState = (state) => state.mvg.closest_stations
  let closestStations = yield select(getClosestStationsFromState)

  if(closestStations && closestStations.length) {
    let closestStationsId = closestStations.map(s => s.id)
    let departures = yield all(closestStationsId.map(id => call(apiInstance.getDepartureById.bind(apiInstance),id)))
    let departureLists = Utils.flattenList(departures)
      .sort((a,b) => a.departureTime - b.departureTime)
      .map(dep => ({...dep,from: closestStations.find(station => station.id == dep.id)})) // put the station origin back to the departures
    yield put({type:MVGAction.GET_DEPARTURES_SUCCESS,departures: departureLists})
  }
}

export function* watchFetchStations() {
  yield takeEvery(MVGAction.GET_STATIONS,fetchStation)
}

export function* watchGetDepartures() {
  yield takeLatest(MVGAction.GET_DEPARTURES,onGetDepartures)
}

// given a successful fetch of stations, trigger the closest point calculation
export function* watchFetchStationsSuccess() {
  yield takeLatest(MVGAction.FETCH_STATION_SUCCESS,onFetchStationSuccess)
}
