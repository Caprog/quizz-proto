import { WebSocketRouter } from "../../src/shared/client.shared.js"
import { connect } from "../../src/client/client.js"
import { WS_URL } from "../../src/shared/contants.shared.js"
import assert from 'node:assert/strict'

export class TestClient {

    state = {}
    error = null
    dataHistory = []
    messages = []
    send = null
    isReady = null
    performClose = null

    connect() {
        const messageHandler = WebSocketRouter(
            (data) => { 
                this.dataHistory.push(data)
                this.state = data 
            }, 
            (error) => { this.error = error },
            () => { this.performClose() }
        )

        const { send, isReady, close } = connect(
            WS_URL, 
            messageHandler
        )

        this.send = (type, payload) => {
            this.messages.push({ type, payload })
            send(type, payload) 
        }
        this.isReady = isReady
        this.performClose = close
        return this
    }

    async evaluate(opt) {
        if(!opt) throw new Error('No expression provided')
        const { expression, message, retry = 10, timeout = 200 } = opt
        await waiting(() => expression?.(this), retry, timeout)
        assert.ok(expression?.(this), JSON.stringify({
            message,
            state: this.state ?? {},
            error: this.error ?? {},
            messages: this.messages ?? [],
            dataHistory: this.dataHistory ?? []
        }, null, 2))
        return this
    }

    async execute(opt) {
        if(!opt) throw new Error('No expression provided')
        const { setup, ...rest } = opt
        await setup?.(this)
        await new Promise(resolve => setTimeout(resolve, 100))
        return this.evaluate(rest)
    }

    async executeAll(opts) {
        for (const opt of opts) {
            await this.execute(opt)
        }
        return this
    }

    close() {
        this.performClose?.()
        return this
    }

    sendAction(actionName, payload) {
        const action = this.state?.me?.actions?.[actionName]
        if (!action) throw new Error(`Action ${actionName} not found`)
        this.send(action?.type, payload)
        return this
    }
}

const waiting = async (evaluate, retry = 10, timeout = 200) => {
    if (await evaluate()) return
    if (retry <= 0) return
    await new Promise(resolve => setTimeout(resolve, timeout))
    await waiting(evaluate, retry - 1, timeout)
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
