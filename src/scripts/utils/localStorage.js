export function setLocalStorageData(item, arr){
    localStorage.setItem(item, JSON.stringify(arr))
}

export function getLocalStorageData(item){
    return JSON.parse(localStorage.getItem(item))
}