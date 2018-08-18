// provide methods for retrieving list of station of a transport line
const request = require('request')
const Utils = require('../utils/utils')
const Store = require('./destination')
const cheerio = require('cheerio')
export default class {

  constructor() {
    this.storeEncodeKey = 'encode'
    this.proxy = "http://localhost:9898/mvv"
    // this.endpoint = "https://efa.mvv-muenchen.de/ng/XML_GEOOBJECT_REQUEST?"
    this.endpoint = `${this.proxy}/ng/XML_GEOOBJECT_REQUEST?`
    // this.encodingEndpoint = "https://efa.mvv-muenchen.de/xhr_regiobuses?zope_command=cached"
    this.encodingEndpoint = `${this.proxy}/xhr_regiobuses?zope_command=cached`
    // this.generalEncodingEndpoint = "https://efa.mvv-muenchen.de/"
    this.generalEncodingEndpoint = `${this.proxy}/index.html`
    this.header = {
    }
  }

  // line should be a human-readable value, say "U2", "S1", "171"...
  // this function reads from the cache, if theres nothing it wont try to fetch something new
  async getLineInfoEncode(line) {
    let encodeDict = await Store.getPromise(this.storeEncodeKey)
    // don't have to check whether the object is empty or not,
    // because even if it is the effect is Object.keys will return an empty array
    return Object.keys(encodeDict).filter(key => encodeDict[key] == line)
  }
  // some scraping of the regional bus xhr...
  async fetchRegionalBusEncodings() {
    try {
      let response = await this.performRequest(this.encodingEndpoint,false)
      let $ = cheerio.load(response)
      let resultObj = Object.assign(
        ...$('label').map(
          (i,el) => ({
            [$(el).find('input').attr('value')]:
             $(el).find('img').attr('alt')}))
        .get()
      )
      return resultObj
    } catch(e) {
      return null
    }
  }
  // some scraping of the general encodings
  async fetchGeneralEncodings() {
    try {
      let response = await this.performRequest(this.generalEncodingEndpoint,false)

      let $ = cheerio.load(response)
      let resultObj = Object.assign(
        ...$('label')
          .filter((i,el) => $(el).has('input'))
          .map((i,el) => ({[$(el).find('input').attr('value')]:
              $(el).find('img').attr('alt')})
            )
          .get()
      )
      return resultObj
    } catch(e) {
      return null
    }
  }
  async fetchLineEncodings(useCache = true) {
    if(useCache) {
      let data = await Store.getPromise(this.storeEncodeKey)
      if(Object.keys(data).length) return data
    }
    // dont use cache here
    let responses = await Promise.all([
      this.fetchRegionalBusEncodings(),
      this.fetchGeneralEncodings(),
    ])
    // aggregate results
    let resultObj = {...responses[0],...responses[1]}
    await Store.setPromise(this.storeEncodeKey,resultObj)
    return resultObj

  }
  // given a line number, search for its corresponding encoding on MVV and fetch the stations list of it,
  // this function gives the cached value if there is one
  async getLineInfo(line, useCache = true) {
    // try to find the relevant record from cache first
    if(line.indexOf('-') > 0) {
      // like and SEV, split and get the first half and try again
      return await this.getLineInfo(line.split('-')[0],useCache)
    }
    if(useCache) {
      let data = await Store.getPromise(line)
      // use cache if possible
      if(Object.keys(data).length > 0) {
        return data
      }
    }

    // no such thing in cache, get and store it
    // first get the encode cache
    let encode = await this.getLineInfoEncode(line)
    if(!encode) return null // no cache sorry, you're out of luck
    // otherwise fetch the encoding
    let getRequestURL = encode => `${this.endpoint}&line=${encode}&outputFormat=json&coordListOutputFormat=STRING&hideBannerInfo=1&lineReqType=6&returnSinglePath=1&command=bothdirections`

    try {
      // perform request, fetch station object, then store it

      let response = await Promise.all(encode.map(getRequestURL).map(this.performRequestJSON.bind(this)))
      // check if all responses contain expected value, i.e. the geoObjects
      if(response.some(r => !r.geoObjects)) {
        return null
      }
      // obtain the result by combining all the line together...
      let finalResult = Utils.flattenList(response.map(r => r.geoObjects.items.map(item => item.item)))
      // try to cache it
      await Store.setPromise(line,finalResult)
      return finalResult
    } catch(e) {

      return null
    }
  }

  performRequestJSON(url) {
    return fetch(url,{
      // mode: 'no-cors',
      headers: {
        ...this.header,

      }
    }).then(response => {
      // if(!response.ok) throw {error: response,statusCode: response.status}
      return response.json()
    })
  }

  performRequest(url) {
    return fetch(url,
    {
      headers: this.header
    }).then(response => {
      return response.text()
    })
  }
  // given a connection (to destId....)
  getPartsForNthConnection(connections,destId,currentTime,n) {
    if(!connections[destId]) return null
    let conns = connections[destId].filter(conn => conn.departure > currentTime)
    if(conns.length <= n) return null
    let conn = conns[n]
    return conn.connectionPartList
  }
  /*
    Given the part list from ONE PLACE TO ANOTHER , e.g. [{'U2',from: ..., to: ...,...},{'U3',...},...]
    and the details of each lines [{'U2':[<station_list>],....}],
    as well as the list of stations ( :( )
    compute the list of coordinates for the line, as well as the
  */
  getLineForConnection(partList,lines,stations) {
    return Object.assign(...partList.map(part => {
      // this handles the SEVs, from S1-3a to S1...
      let partLabel = Utils.getConnectionPartCacheLabel(part)
      if(!partLabel) return null
      let {coords,mvvStationParts} = this.computeLineSegment(
          part.from.id,
          part.to.id,
          part.label,        // use the de-SEV labels to compute Line segments
          lines,stations)
      if(!coords) coords = [[part.from.latitude,part.from.longitude],[part.to.latitude,part.to.longitude]]
      let fromStationId = part.from.id,
          toStationId   = part.to.id
      return {[partLabel]:{
        label: part.label, // but display the original SEVs
        coords,
        // these will be useful later
        fromStationId,
        toStationId,

      }}
    }).filter(record => !!record)) // no null here!
  }
  // given the items[0] of each station line object (which means with * -> geoObjects -> items[0])
  // which should have mode,paths,points
  // try to sort the stations according to the path within the item
  // the idea is: the path itself must be sorted (otherwise you cant render a line on map...)
  // then for each station, get the closest point to the path, and the index of it,
  // finally sort them according to the array of closest coords
  sortStations(items) {
    // the path is located at * -> paths[0] -> path...
    // get the coords (2 numbers) from the path string
    let path = items.paths[0].path.split(' ').map(Utils.coordsStringToCoord)
    let stations = items.points.map(pt => ({...pt,coords : Utils.coordsStringToCoord(pt.ref.coords)}))
    // give the stations indices...
    stations.forEach(pt => pt.index = Utils.getIndexOfClosestCoords(path,pt.coords))

    return stations.sort((sa,sb) => sa.index - sb.index)

  }

  getStationsBetween(fromId,toId,mvvStations,range = 0) {
    // TODO: complete the range search!
    let
        purifyId = (id) => parseInt(id) % 1e5, // gonna use this later
        mvvStationsIds = mvvStations.map(s => purifyId(s.ref.id)),
        fromIdInList = mvvStationsIds.indexOf(fromId),
        toIdInList   = mvvStationsIds.indexOf(toId),
        getStationById = (id) => mvvStations.find(s => purifyId(s.ref.id) == id), // just in case...
        hasInvalid = fromIdInList < 0 || toIdInList < 0
    if(hasInvalid && range) { // enable range search
      if(fromIdInList < 0) {
        // this index is invalid!
        // let fromStation = mvvStations.find()
      }
      if(toIdInList < 0) {
        // recover it
      }
    }
    if (hasInvalid) return null
    else return (fromIdInList < toIdInList)?
      mvvStations.slice(fromIdInList,toIdInList + 1) :
      mvvStations.slice(toIdInList,fromIdInList + 1)
  }
  // given a connection (from station to station),lines (containing stations of all lines), and the cache (from state)
  // give a computed new line segments
  computeLineSegment(fromStationId,toStationId,label,lines,stations) {
    let isSEV = false
    if(label.indexOf('-') > -1) {
      label = label.split('-')[0]
      isSEV = true
    }
    if (!lines[label] || !lines[label].length) return null
    let items = lines[label][0]
    let sortedStations = this.sortStations(items)

    // now this is getting REALLY troublesome:
    // since SEV is a SEV, that the station may or may not be the same from the line it replaces/
    // e.g. SEV for S1's SEV starts from Feldmoching Bf. Ost, but clearly this station isn't passed through by S1
    // therefore a RANGE SEARCH is needed to recover such station,
    // this is based on an assumption that a SEV shouldnt start far away from the existing station,
    // and that it should also be making use of the existing stations instead of making up a temporary one
    let range = isSEV && 5 // search the closest 5 stations, which may or may not be the substitude of the affected station...
    // get the parts (sub-list of stations) between the starting station and ending station
    let mvvStationParts = this.getStationsBetween(fromStationId,toStationId,sortedStations,range)
    if(!mvvStationParts) return {
      coords: null,
      mvvStationParts
    }

    // let smoothPathCoords = Utils.getSmoothPathCoordsInLatLng(items,mvvStationParts,stations)
    // TODO: switch to smooth path!
    // return smoothPathCoords
    let mvvStationPartsWithCoordinates = mvvStationParts.map(s => Utils.convertMVVStationToMVGStation(s,stations))
    let coords = mvvStationPartsWithCoordinates.map(s => s.coords)

    return {coords,mvvStationParts}
  }
}
