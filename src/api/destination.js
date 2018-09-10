// const storage = require('electron-json-storage');
import feathers from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'

export const DATABASE_URL = "http://localhost:3001"
const app = feathers()

// Connect to a different URL
const restClient = rest(DATABASE_URL)
app.configure(restClient.fetch(window.fetch))
const destinationService = app.service('destination')

export const getDestinations = async () => {
  let destinations =  await destinationService.find()
  console.log('destinations',destinations)
  return destinations
}
export const addDestinations = async (dest) => {
  return await destinationService.create(dest)
}

export const removeDestinations = async (destId) => {
  console.log('dest id',destId)
  return await destinationService.remove(destId)
}
export const clearDestinations = async () => {
  return await destinationService.remove(null,{}) // clear all
}
// promises for dealing with exisiting localStorage stuff
export const setPromise = (key,data) => new Promise((resolve,reject) => {
  window.localStorage.setItem(key,JSON.stringify(data))
  resolve({key,data})
  // storage.set(key,data,(e) => {
  //   if(e) reject(e)
  //   else resolve({key,data})
  // })
})
export const getPromise = (key) => new Promise((resolve,reject) => {
  let result = window.localStorage.getItem(key)
  if(!result) resolve({})
  try {
    resolve(JSON.parse(result))
  } catch(e) {
    reject(e)
  }

  // storage.get(key,(e,data) => {
  //   if(e) reject(e)
  //   else resolve(data)
  // })
})


export const clearPromise = (key) => new Promise((resolve,reject) => {
  resolve(window.localStorage.clear())
})

export const removePromise = (key,id) => new Promise((resolve,reject) => {
  try {
    let obj = JSON.parse(window.localStorage.getItem(key))
    setPromise(key,obj.filter(s => s.id != id))
      .then(res => resolve(res))
      .catch(e => reject(e))
  } catch(e) {
    reject(e)
  }
})
