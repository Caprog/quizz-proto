const actions = {
    next: { type: 'next' }   
}

const handle = (playerId, type, payload) => {
    if(type === 'next') {
        console.log('next')
    }
}

const enter = (playerId) => {
    return {}
}

const exit = (playerId) => {
    return {}
}

const sync = (playerId) => {
    return {}
}

const getActions = (playerId) => {
    return actions
}

export const FeedbackPhase = {
    enter,
    exit,
    sync,
    getActions,
    handle
}


