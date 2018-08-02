const storage = require('electron-json-storage');

export const setPromise = (key,data) => new Promise((resolve,reject) => {
  storage.set(key,data,(e) => {
    if(e) reject(e)
    else resolve({key,data})
  })
})
export const getPromise = (key) => new Promise((resolve,reject) => {
  storage.get(key,(e,data) => {
    if(e) reject(e)
    else resolve(data)
  })
})

export const clearPromise = (key) => new Promise((resolve,reject) => {
  storage.remove(key,(e) => {
    console.log('clear promise ok')
    if(e) reject(e)
    else resolve()
  })
})

export const removePromise = (key,id) => {
  return getPromise(key)
    .then(stations => {
      let newStations = stations.filter(s => s.id != id)
      return setPromise(key,newStations)
    })
}
