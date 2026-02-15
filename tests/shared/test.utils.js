import { WebSocketRouter } from "../../src/shared/client.shared.js"
import { connect } from "../../src/client/client.js"
import { WS_URL } from "../../src/shared/contants.shared.js"
import assert from 'node:assert/strict'

export class TestClient {

    state = {}
    error = null
    send = null
    isReady = null
    performClose = null

    connect() {
        const messageHandler = WebSocketRouter(
            (data) => {
                this.state = data
            }, 
            (error) => {
                this.error = error
            }
        )

        const { send, isReady, close } = connect(
            WS_URL, 
            messageHandler.onmessage
        )

        this.send = send
        this.isReady = isReady
        this.performClose = close
        return this
    }

    async evaluate(opt) {
        if(!opt) throw new Error('No expression provided')
        const { expression, message, retry = 10, timeout = 200 } = opt
        await waiting(() => expression?.(this), retry, timeout)
        assert.ok(expression?.(this), message)
        return this
    }

    async execute(opt) {
        if(!opt) throw new Error('No expression provided')
        const { setup, ...rest } = opt
        await setup?.(this)
        return this.evaluate(rest)
    }

    async evaluateAll(opts) {
        for (const opt of opts) {
            await this.evaluate(opt)
        }
        return this
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
