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
export const unixTimeStampToDateHHMM = (ts) => {
  let time = unixTimeStampToDate(ts)
  let pad = (s) => s.toString().padStart(2,'0')
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
export const listOfN = (n) => [...Array(n + 1).keys()].slice(1)
