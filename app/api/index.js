const request = require('request')
const Utils = require('../utils/utils')
export default class {
  constructor() {
    this.endpoint = "https://www.mvg.de/fahrinfo/api"
    this.header =  {
      "X-MVG-Authorization-Key": "5af1beca494712ed38d313714d4caff6"
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
  // useful functions
  async getAllStations() {
    let url = this.getStationsUnrestrictedEndpoint("")
    try {
      let response = await this.performRequest(url)
      return response.locations
    } catch(e) {
      return e
    }

  }
  async getDepartureById(id,numDepartures = -1) {
    let url = this.getDepartureEndpointById(id)
    let response = await this.performRequest(url)
    if(response.error) return response // sorry..
    if(numDepartures <= 0 ) return response.departures
    return response.departures.slice(0,numDepartures)
  }

  async getClosestStations(lat,lng,stations,number = 5) {
    if(number <= 0 ) return []
    console.log('got station list')
    console.log(stations)
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
    return new Promise((resolve,reject) => {
      request.get({uri:url,encoding:null,headers:this.header},(error,response,body) => {
        if(!error && response.statusCode == 200) {
          // success
          try {
            let res = JSON.parse(body)
            resolve(res)
          } catch (e) {
            // cannot parse response
            reject({
              error: "Unable to parse json",
              body: body
            })
          }

        } else reject({error,statusCode: response.statusCode})
      })
    })
  }
}
