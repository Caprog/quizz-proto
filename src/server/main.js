import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { PORT } from '../shared/contants.shared.js'
import { initWebSocketServer } from './ws.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use('/shared', express.static(path.join(__dirname, '../shared')))
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
    initWebSocketServer(server)
})


