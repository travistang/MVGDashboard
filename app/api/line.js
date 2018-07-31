// provide methods for retrieving list of station of a transport line
const request = require('request')
const Utils = require('../utils/utils')
const Store = require('./destination')
const cheerio = require('cheerio')

export default class {

  constructor() {
    this.storeEncodeKey = 'encode'
    this.endpoint = "https://efa.mvv-muenchen.de/ng/XML_GEOOBJECT_REQUEST?"
    this.encodingEndpoint = "https://efa.mvv-muenchen.de/xhr_regiobuses?zope_command=cached"
    this.generalEncodingEndpoint = "https://efa.mvv-muenchen.de/"
  }

  // line should be a human-readable value, say "U2", "S1", "171"...
  // this function reads from the cache, if theres nothing it wont try to fetch something new
  async getLineInfoEncode(line) {
    let encodeDict = await Store.getPromise(this.storeEncodeKey)
    console.log('encodde dict')
    console.log(encodeDict)
    // don't have to check whether the object is empty or not,
    // because even if it is the effect is Object.keys will return an empty array
    return Object.keys(encodeDict).filter(key => encodeDict[key] == line)
  }
  // some scraping of the regional bus xhr...
  async fetchRegionalBusEncodings() {
    try {
      console.log('fetching regional bus encodings')
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
      console.log('fetchRegionalBusEncodings got error:')
      console.log(e)
      return null
    }
  }
  // some scraping of the general encodings
  async fetchGeneralEncodings() {
    try {
      console.log('fetching general encodings')
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
      console.log('result object from general encodings')
      console.log(resultObj)
      return resultObj
    } catch(e) {
      console.log('fetchGeneralEncodings got error:')
      console.log(e)
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
      console.log(`result for getting line info for ${line}:`)
      console.log(response)
      // check if all responses contain expected value, i.e. the geoObjects
      if(response.some(r => !r.geoObjects)) {
        console.log(`got invalid stations for line ${line}`)
        console.log(response)
        return null
      }
      // obtain the result by combining all the line together...
      let finalResult = Utils.flattenList(response.map(r => r.geoObjects.items.map(item => item.item)))
      // try to cache it
      console.log('final result')
      console.log(finalResult)
      await Store.setPromise(line,finalResult)
      return finalResult
    } catch(e) {
      console.log(`got error when getting line info for ${line}`)
      console.log(e)
      return null
    }
  }
  performRequestJSON(url) {
    return new Promise((resolve,reject) => {
      request.get({uri:url,encoding: null},(error,response,body) => {
        if(!error && response.statusCode == 200) {
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
        }
        else reject({error,statusCode: response.statusCode})

      }) // request
    }) // promise
  }
  performRequest(url) {
    return new Promise((resolve,reject) => {
      request.get({uri:url,encoding: null},(error,response,body) => {
        if(!error && response.statusCode == 200) {
           resolve(body)
        }
        else reject({error,statusCode: response.statusCode})

      }) // request
    }) // promise
  }
}
