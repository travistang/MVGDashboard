export const GET_STATIONS = 'GET_STATIONS'
export const GET_DEPARTURES = 'GET_DEPARTURES'
export const GET_CLOSEST_STATIONS = 'GET_CLOSEST_STATIONS'

export function getStations() {
  return {
    type: GET_STATIONS
  }
}

export function getDepartureById(id) {
  return {
    id,
    type: GET_DEPARTURES
  }
}
export function getClosestStations(lat,lng) {
  return {
    type: GET_CLOSEST_STATIONS,
    lat,
    lng
  }
}
