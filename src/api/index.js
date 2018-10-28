const request = require('request')
const Utils = require('../utils/utils')
export default class {
  constructor() {
    // this.orgEndpoint = "https://www.mvg.de/fahrinfo/api"
    this.proxyURL = "http://localhost:9898/mvg"
    this.endpoint = `${this.proxyURL}/fahrinfo/api`
    this.header =  {
      "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6",
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }
  // endpoint composition
  getDepartureEndpointById(id) {
    return `${this.endpoint}/departure/${id}?footway=0`
  }
  getStationsEndpoint(name) {
    return `${this.endpoint}/location/query?q=${name}`
  }
  getStationsUnrestrictedEndpoint(name) {
    return `${this.endpoint}/location/queryWeb?q=${name}`
  }

  getConnectionEndpoint(from_id,to_id) {
    return `${this.endpoint}/routing/?fromStation=${from_id}&toStation=${to_id}`
  }
  // useful functions
  // for all of them, do not reject, use error instead
  async getAllStations() {
    let url = this.getStationsUnrestrictedEndpoint("")
    try {
      let response = await this.performRequest(url)
      if(response.error) return {error: response.error}
      return response.locations
    } catch(e) {
      return {error:e}
    }

  }
  async getConnections(from_id,to_id) {
    let url = this.getConnectionEndpoint(from_id,to_id)
    let response = await this.performRequest(url)
    if(response.error || !response.connectionList) return response
    return response.connectionList // the "connectionPartList" inside each element will be useful
  }

  async getDepartureById(id,numDepartures = -1) {
    let url = this.getDepartureEndpointById(id)
    let response = await this.performRequest(url)
    if(response.error) return response // sorry..
    let result,
        now = new Date(),
        validDepartures = response.departures.filter(departure => departure.departureTime >= now)
    if(numDepartures <= 0 ) result = validDepartures
    else result = validDepartures.slice(0,numDepartures)
    return result.map(dep => ({...dep,id})) // add the request id to departures, so that the origin of the departure can be traced later
  }
  async getServingLines(id) {
    let url = this.getDepartureEndpointById(id)
    let response = await this.performRequest(url)
    if(response.error) return response
    return response.servingLines.map(line => ({
      destination: line.destination,
      line: line.lineNumber,
      product: line.product
    }))
  }
  getClosestStations(lat,lng,stations,number = 3) {
    if(number <= 0 ) return []
    if(stations.error) return stations // this is an error!
    // now filter the closest
    // kudos https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula#27943


    let stationsByDistance = stations.sort((a,b) => {
      // convert a,b to the distance given
      let latA = a.latitude
      let lngA = a.longitude
      let latB = b.latitude
      let lngB = b.longitude

      return Utils.getDistanceFromLatLonInKm(lat,lng,latA,lngA) - Utils.getDistanceFromLatLonInKm(lat,lng,latB,lngB)
    })

    return stationsByDistance.slice(0,number)
  }

  // perform actual requests
  performRequest(url) {
    return fetch(url,{
      headers: this.header,
    }).then(response => {
      if(!response.ok) return {error:response}
      return response.json()
    })
  }
}
