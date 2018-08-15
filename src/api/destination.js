// const storage = require('electron-json-storage');

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
  // storage.remove(key,(e) => {
  //   console.log('clear promise ok')
  //   if(e) reject(e)
  //   else resolve()
  // })
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
