import { proxy, subscribe } from 'https://esm.sh/valtio'
import { devtools } from 'https://esm.sh/valtio/utils'

export const state = proxy({
    payload: {}
})

export const unsubDevTools = devtools(state, { name: 'state', enabled: true })

window.state = state


export const mock = {
    room: {
        room_code: 'lfpg',
        maxPlayers: 12,
        playersCount: 12
    },
    players: {
        jxqxryg: {
        connected: true,
        isBot: false,
        name: 'PrototypeRapide',
        score: 1,
        gainedPoints: 0
        },
        qgdhyq9: {
        connected: true,
        isBot: true,
        name: 'ViteFait',
        score: 2,
        gainedPoints: 0
        },
        // add 6 more players with a score between 0 and 10
        'bot1': {
            connected: true,
            isBot: true,
            name: 'Bot 1',
            score: 0,
            gainedPoints: 0
        },
        'bot2': {
            connected: true,
            isBot: true,
            name: 'Bot 2',
            score: 1,
            gainedPoints: 0
        },
        'bot3': {
            connected: true,
            isBot: true,
            name: 'Bot 3',
            score: 2,
            gainedPoints: 0
        },
        'bot4': {
            connected: true,
            isBot: true,
            name: 'Bot 4',
            score: 3,
            gainedPoints: 0
        },
        'bot5': {
            connected: true,
            isBot: true,
            name: 'Bot 5',
            score: 4,
            gainedPoints: 0
        },
        'bot6': {
            connected: true,
            isBot: true,
            name: 'Bot 6',
            score: 5,
            gainedPoints: 0
        },
        'bot7': {
            connected: true,
            isBot: true,
            name: 'Bot 7',
            score: 6,
            gainedPoints: 0
        },
        'bot8': {
            connected: true,
            isBot: true,
            name: 'Bot 8',
            score: 7,
            gainedPoints: 0
        },
        'bot9': {
            connected: true,
            isBot: true,
            name: 'Bot 9',
            score: 8,
            gainedPoints: 0
        },
        'bot10': {
            connected: true,
            isBot: true,
            name: 'Bot 10',
            score: 9,
            gainedPoints: 0
        },
        'bot11': {
            connected: true,
            isBot: true,
            name: 'Bot 11',
            score: 10,
            gainedPoints: 0
        },
        'bot12': {
            connected: true,
            isBot: true,
            name: 'Bot 12',
            score: 11,
            gainedPoints: 0
        }
    },
    game: {
        type: 'TRIVIA',
        phase: 'lobby'
    },
    me: {
        id: 'jxqxryg',
        connected: true,
        isBot: false,
        score: 0,
        gainedPoints: 0,
        name: 'PrototypeRapide'
    }
}