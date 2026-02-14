import { connect } from "../src/client.js"
import { WS_URL } from "../src/contants.shared.js"
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

    async evaluate(expression, message = '') {
        const evaluate = async () => expression(this)
        await waiting(evaluate)
        assert.ok(await evaluate(), message)
        return this
    }

    close() {
        this.ws?.close?.()
        return this
    }
}


const waiting = (evaluate, retry = 3, timeout = 200) => new Promise((resolve) => setTimeout(() => evaluate() ? resolve() : waiting(evaluate, retry - 1, timeout), timeout))

