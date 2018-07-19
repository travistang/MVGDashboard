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
