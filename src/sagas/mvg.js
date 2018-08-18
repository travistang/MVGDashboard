// sagas that listens to MVG-api related action
// also launch actual api requests and dispatch action
import {takeLatest,takeEvery} from 'redux-saga'
import { take,put,call,select,all } from "redux-saga/effects"
import * as MVGAction from '../actions/mvg'
import * as DestinationAction from '../actions/destination'
import Api from '../api'
import * as Utils from '../utils/utils'
import * as LocationSaga from './location'
import {getPromise,setPromise} from '../api/destination'
import Line from '../api/line'

const apiInstance = new Api()
const lineInstance = new Line()

export function* fetchStation() {
  let stations
  let storeKey = "stations"
  stations = yield call(getPromise,storeKey)
  if(Object.keys(stations).length == 0) {
    // no stations stored in local storage, fetch from internet
    stations = yield call(apiInstance.getAllStations.bind(apiInstance))
    console.log('stations')
    console.log(stations)
    if(stations.error) {
      yield put({type: MVGAction.FETCH_STATION_FAILED,error: stations.error})
    } else {
      yield put({type: MVGAction.FETCH_STATION_SUCCESS, stations})
      yield call(setPromise,storeKey,stations)
    }

  } else {
    // get from store
    yield put({type: MVGAction.FETCH_STATION_SUCCESS,stations})
  }

}
// TODO: get the location from store
function* getGeoLocation() {
  // location should then be {lat,lng}
  let location = yield call(LocationSaga.getLocation)

  if(!location) {
    // default location :)
    return {
      // Location of Giesing
      lat: 48.11081,
      lng: 11.594633,
    }
  } else return location
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

function* onGetConnection({target_station_id}) {
  const getClosestStationsFromState = (state) => state.mvg.closest_stations
  let closestStations = yield select(getClosestStationsFromState)

  if(closestStations && closestStations.length) {
    let closestStation = closestStations[0]
    let from_station_id = closestStation.id
    let connections = yield call(
      apiInstance.getConnections.bind(apiInstance),
      from_station_id,target_station_id)
    if(!connections || !connections.length || connections.error) yield put({type: MVGAction.GET_CONNECTION_FAILED,error: connections.error})
    else {
      // now try to make the reducer's life easier
      // indicate the DESTINATION of this list of connections
      let connectionsListObj = {
        [connections[0].to.id]: connections
      }
      yield put({type: MVGAction.GET_CONNECTION_SUCCESS,connections: connectionsListObj})
    }
  }
}
function* onAddDestinationSuccess(action) {
  yield call(onGetConnection,{target_station_id: action.station.id})
}
function* onGetDepartures() {
  const getClosestStationsFromState = (state) => state.mvg.closest_stations
  let closestStations = yield select(getClosestStationsFromState)

  if(closestStations && closestStations.length) {
    let closestStationsId = closestStations.map(s => s.id)
    let departures = yield all(closestStationsId.map(id => call(apiInstance.getDepartureById.bind(apiInstance),id)))
    if(!departures || !departures.length) {
      // unable to get departures...
      yield put({type: MVGAction.GET_DEPARTURES_FAILED})
      return
    }
    let departureLists = Utils.flattenList(departures.filter(d => !d.error))
      .sort((a,b) => a.departureTime - b.departureTime)
      .map(dep => ({...dep,from: closestStations.find(station => station.id == dep.id)})) // put the station origin back to the departures
    yield put({type:MVGAction.GET_DEPARTURES_SUCCESS,departures: departureLists})
  }
}
// callback for taking "GET_CONNECTION_SUCCESS" event from the destination actions.
// yield all connections to connections FROM THE CLOSEST STATION once and for all
// TODO: how about from all closest stations to all destinations?!
function* fetchConnectionsToAllStations(action) {
  let destinations = action.destinations
  // now destinations should be a list of stations, get the list...
  let destinations_ids = destinations.map(d => d.id)
  // invoke get connections actions given list of destinations ids, onGetConnection should do the rest
  // (including the invocation of GET_CONNECTION_SUCCESS)
  yield all(destinations_ids.map(id => call(onGetConnection,{target_station_id: id})))

}

/*
  What it does:
    for each of the destinations, get the earliest connections of each of them.
    for each of the connections, gather the parts of them
    if theres no such parts on the state, calculate it,

    then put actions and store the result

*/
function* onComputeLineSegment() {
  // objects storing the way to go from one place to another, in different times, in different ways
  let connections = yield select(state => state.mvg.connections)
  // wait wait, this is also the line we're gonna display!
  // let cache = yield select(state => state.mvg.connectionLines)
  // this stores the list of stations
  let stations = yield select(state => state.mvg.stations)
  let currentTime = yield select(state => state.clock.currentTime)
  // this stores the list of stations a transport line is gonna travel through
  let lines = yield select(state => state.mvg.lines)
  let currentParts = {} // try to remove all unnecessary parts by remembering whats the part we have currently

  if(!Object.keys(connections).length || !stations || ! lines) return
  // The line retrieval part should be done in the lineInstance instead...

  // let earliestConnections
  // TODO: DO NOT FLATTEN THE LIST OF CONNECTIONS!
  // Instead map to them
  let displayLines = Object.assign(...(Object.keys(connections)
      .map(destId => { // mapping to a list of generators...
        let firstConnectionParts = lineInstance.getPartsForNthConnection(connections,destId,currentTime,0)
        let lineForConnection = lineInstance.getLineForConnection(firstConnectionParts,lines,stations)
        return lineForConnection
      }) //
      // then connectionsList is now a list of ... connections, with each of the the earliest connectionPartList
      .filter(part => !!part) // may or may not be null, if there are no connection between the two places...
    ) // make sure the labels exist
  )
  console.log('display lines')
  console.log(displayLines)
  yield put({type: MVGAction.SET_LINE_SEGMENT_CACHE,connectionLines:displayLines})
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

export function* watchGetConnections() {
  // take every because multiple "GET_CONNECTION" action may be dispatched
  yield takeEvery(MVGAction.GET_CONNECTION,onGetConnection)
}

// also watch when get destination success
// because after the destination fetching success the connections to them needs to be explicitly fetched
export function* watchGetDestinationSuccess() {
  yield takeLatest(DestinationAction.GET_DESTINATION_SUCCESS,fetchConnectionsToAllStations)
}

// also need to watch a successful add of destination...
// because the connections of the new dest needs to be fetched immediately..
export function* watchAddDestinationSuccess() {
  yield takeEvery(DestinationAction.ADD_DESTINATION_SUCCESS,onAddDestinationSuccess)
}

export function* watchComputeLineSegment() {
  yield takeLatest(MVGAction.COMPUTE_LINE_SEGMENT,onComputeLineSegment)
}

// also evaluate line segments again if a station is removed
export function* watchDestinationRemove() {
  yield takeLatest(DestinationAction.REMOVE_DESTINATION_SUCCESS,onComputeLineSegment)
}
export function* watchDestinationAdd() {
  yield takeLatest(DestinationAction.ADD_DESTINATION_SUCCESS,onComputeLineSegment)
}
