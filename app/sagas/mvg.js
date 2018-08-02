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
    if(stations.error) {
      yield put({type: MVGAction.FETCH_STATION_FAILED,error: error})
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
  console.log('on get connection!')
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
    let departureLists = Utils.flattenList(departures)
      .sort((a,b) => a.departureTime - b.departureTime)
      .map(dep => ({...dep,from: closestStations.find(station => station.id == dep.id)})) // put the station origin back to the departures
    yield put({type:MVGAction.GET_DEPARTURES_SUCCESS,departures: departureLists})
  }
}
// callback for taking "GET_CONNECTION_SUCCESS" event from the destination actions.
// yield all connections to connections FROM THE CLOSEST STATION once and for all
// TODO: how about from all closest stations to all destinations?!
function* fetchConnectionsToAllStations(action) {
  console.log('fetch all stations connections!')
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
  let connections = yield select(state => state.mvg.connections)
  let cache = yield select(state => state.mvg.connectionLines)
  let stations = yield select(state => state.mvg.stations)
  let currentTime = yield select(state => state.clock.currentTime)
  let lines = yield select(state => state.mvg.lines)
  let currentParts = {} // try to remove all unnecessary parts by remembering whats the part we have currently
  let hasUpdate = false
  if(!connections || !cache || !stations || ! lines) return
  let earliestConnections
  try {
    earliestConnections = Utils.flattenList(
      Object.keys(connections).map(destId => {
        let conns = connections[destId].filter(conn => conn.departure > currentTime)
        if(conns.length == 0) return null
        // get the first departure
        let conn = conns[0]
        return conn.connectionPartList
      })
    )
    .filter(part => !!part)
    .filter(part => !!part.label) // make sure the labels exist
    .reduce((acc,part) => { // remove duplicate
      if(!acc.find(curPart => curPart.label == part.label)) return acc.concat(part)
      else return acc
    },[])
  } catch(e) {
    console.log('onComputeLineSegment got error:')
    console.log(e)
    return
  }
  earliestConnections.forEach(part => {
    // for each part, get the label...
    let partLabel = Utils.getConnectionPartCacheLabel(part)
    // try to search for cache
    let coords = (cache[partLabel] && cache[partLabel].coords)
    if(!coords) {
      // mark has updated
      hasUpdate = true
      coords = lineInstance.computeLineSegment(part.from.id,part.to.id,part.label,lines,stations)
      if(!coords) return // can't compute this, give up
    }
    currentParts[partLabel] = {
      from: part.from.id,
      to:   part.to.id,
      label:part.label,
      // try to see if theres such a cache, if not then compute it
      coords
    }
  })

    console.log('has update, result:')
    console.log(currentParts)
    yield put({type: MVGAction.SET_LINE_SEGMENT_CACHE,connectionLines:currentParts})
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
