const request = require('request')
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
  // useful functions
  async getAllStations() {
    let url = this.getStationsEndpoint("")
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

  async getClosestStations(lat,lng,number = 5) {
    if(number <= 0 ) return []

    let stations = await this.getAllStations()
    if(stations.error) return stations // this is an error!
    // now filter the closest
    // kudos https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula#27943
    let deg2rad = function(deg) {
      return deg * (Math.PI/180)
    }

    let getDistanceFromLatLonInKm = function(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    let stationsByDistance = stations.sort(a,b => {
      // convert a,b to the distance given
      let latA = a.latitude
      let lngA = a.longitude
      let latB = b.latitude
      let lngB = b.longitude

      return getDistanceFromLatLonInKm(lat,lng,latA,lngA) < getDistanceFromLatLonInKm(lat,lng,latB,lngB)
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
