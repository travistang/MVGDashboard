import React from 'react'
import LineTag from '../components/LineTag'

export const getStationName = (station) => {
  let {name,place} = station
  if(!name || ! place) return ""
  return `${name}, ${place}`
}


let deg2rad = function(deg) {
  return deg * (Math.PI/180)
}

export const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
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

export const getProductColorCode = (product) => {
  switch(product) {
    case 'SBAHN':
      return "#964438"
    case 'UBAHN':
      return "#dd3d4d"
    case 'BUS':
      return "#0d5c70"
    case 'TRAM':
      return "#ea4029"
    default: return ""
  }
}

export const getProductShortName = (product) => {
  switch(product) {
    case 'TRAM':
      return 'Tram'
    case 'BUS':
      return product
    default:
      return product[0]
  }
}

export const getStationProductLineTags = (station) => {
  return station.products.map(p => <LineTag line={getProductShortName(p)} backgroundColor={getProductColorCode(p)} />)
}

export const flattenList = (lists) => {
  return lists.reduce((a,b) => ([...a,...b]))
}

export const unixTimeStampToDate = (ts) => new Date(ts)
export const pad = (s,len = 2) => s.toString().padStart(len,'0')
export const unixTimeStampToDateHHMM = (ts) => {
  let time = unixTimeStampToDate(ts)
  // let pad = (s) => s.toString().padStart(2,'0')
  let hh = pad(time.getHours())
  let mm = pad(time.getMinutes())
  return `${hh}:${mm}`
}
export const timeDifferenceToDateString = (timeA,timeB) => {
  let diff = timeB - timeA
  let hasPassed = diff < 0
  // https://stackoverflow.com/questions/1787939/check-time-difference-in-javascript#1788084
  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  return {
    hh,mm,ss,hasPassed
  }
}

export const timeDifferenceToDateHHMMSS = (timeA,timeB) => {
  let {hh,mm,ss,hasPassed} = timeDifferenceToDateString(timeA,timeB)
  let res = hasPassed?"-":"" // if time diff is negative, add a "-" in front
  if(hh > 0) res += (pad(hh) + ":") // since its more than an hour, concat the hour component from front
  return `${res}${pad(mm)}:${pad(ss)}`
}
export const listOfN = (n) => [...Array(n + 1).keys()].slice(1)

export const convertMVVStationToMVGStation = (mvvStation,mvgStationList) => {
  let correspondingMVGStation
  try {
    console.log('mvgStationList')
    console.log(mvgStationList)
    console.log('parseint result')
    console.log(parseInt(mvvStation.ref.id) % 1e5)
    correspondingMVGStation = mvgStationList.find(mvgS => mvgS.id == parseInt(mvvStation.ref.id) % 1e5)
  } catch(e) {
    console.log('convert mvv stations to mvg station failed with error')
    console.log(e)
    return null // aw..
  }
  // replace the coordinate to the corresponding mvg station's coordinate...
  let latlngCoord = [
    correspondingMVGStation.latitude,
    correspondingMVGStation.longitude
  ]
  return {...mvvStation, coords: latlngCoord}
}

export const getStationsBetween = (fromId,toId,mvvStations) => {
  let mvvStationsIds = mvvStations.map(s => parseInt(s.ref.id) % 1e5 ),
      fromIdInList = mvvStationsIds.indexOf(fromId),
      toIdInList   = mvvStationsIds.indexOf(toId),
      hasInvalid = fromIdInList < 0 || toIdInList < 0
  if (hasInvalid) return null
  else return (fromIdInList < toIdInList)?
    mvvStations.slice(fromIdInList,toIdInList) :
    mvvStations.slice(toIdInList,fromIdInList)
}

export const getConnectionPartCacheLabel = (part) => {
  let fromStationId = part.from.id,
      toStationId   = part.to.id,
      cacheLabel = `${fromStationId}-${toStationId}-${part.label}`
  return cacheLabel
}
