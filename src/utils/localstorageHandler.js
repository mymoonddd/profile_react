
export function readFromLS(key) {
    let value = localStorage.getItem(key)
    console.log(value)
    return value && JSON.parse(value)
}

export function saveToLS(key, value) {
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

export function resetLS() {
    localStorage.clear()
}