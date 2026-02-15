import { connect } from "../../src/client/client.js"
import { WS_URL } from "../../src/contants.shared.js"
import assert from 'node:assert/strict'

export class TestClient {

    state = {}
    ws = null

    connect() {
        const { ws, send } = connect(WS_URL, (data) => {
            this.state = data
        })
        this.ws = ws
        this.send = send
        return this
    }

    isReady() {
        return this.ws.readyState === WebSocket.OPEN
    }

    async evaluate(opt) {
        if(!opt) throw new Error('No expression provided')
        const { expression, message, retry = 10, timeout = 200 } = opt
        await waiting(() => expression?.(this), retry, timeout)
        assert.ok(expression?.(this), message)
        return this
    }

    async evaluateAll(opts) {
        for (const opt of opts) {
            await this.evaluate(opt)
        }
        return this
    }

    sendAction(actionName, payload) {
        const action = this.state?.me?.actions?.[actionName]
        if (!action) throw new Error(`Action ${actionName} not found`)
        this.send(action?.type, payload)
        return this
    }

    close() {
        this.ws?.close?.()
        return this
    }
}

const waiting = async (evaluate, retry = 10, timeout = 200) => {
    if (await evaluate()) return
    if (retry <= 0) return
    await new Promise(resolve => setTimeout(resolve, timeout))
    await waiting(evaluate, retry - 1, timeout)
}
