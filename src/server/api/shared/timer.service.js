const timers = {} 

const startAndGet = (id, milliseconds, onEnd) => {
    console.log('startAndGet', id, milliseconds)
    if(timers[id]) stop(id)

    timers[id] = setTimeout(() => {
        stop(id)
        setImmediate(() => onEnd())
    }, milliseconds)

    return get(id, milliseconds)
}

const get = (id, milliseconds) => {    
    const timeoutDate = new Date(Date.now() + milliseconds).toISOString()

    return {
        id,
        timeoutDate,
        stop: () => stop(id)
    }
}

const stop = (id) => {
    clearTimeout(timers[id])
    delete timers[id]
}

const exists = (id) => !!timers[id] 

export default {
    startAndGet,
    get,
    exists
}