const timers = {} 

const startAndGet = (id, milliseconds, onEnd) => {
    console.log('startAndGet', id, milliseconds)
    const startTime = Date.now()
    if(timers[id]) stop(id)

    timers[id] = setTimeout(() => {
        stop(id)
        setImmediate(() => onEnd())
    }, milliseconds)

    return get(id, milliseconds, startTime)
}

const get = (id, milliseconds, startTime = Date.now()) => {    
    return {
        id,
        duration: milliseconds,
        getRemaining: () => Math.max(0, milliseconds - (Date.now() - startTime)),
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