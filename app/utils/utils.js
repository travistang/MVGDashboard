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
  return product[0]
}
