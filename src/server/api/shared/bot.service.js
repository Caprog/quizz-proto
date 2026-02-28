import { Worker } from 'node:worker_threads';

export default {
 
    async start() {
        
        const bots = [];

        function createBot(id) {
            const worker = new Worker('./src/server/core/bot.worker.js', {
                workerData: {}
            });

            worker.on('message', (message) => {
                if (message.action === 'match_found') {
                console.log(`Bot ${message.botId} encontró partida: ${message.matchId}`);
                // Lógica para que el servidor asigne el bot a la partida
                }
            });

            worker.on('error', (err) => {
                console.error(`Error en el bot ${id}:`, err);
            });

            worker.on('exit', (code) => {
                if (code !== 0) console.error(`El bot ${id} se detuvo con código ${code}`);
            });

            return worker;
        }

        for (let i = 0; i < 1; i++) {
            bots.push(createBot(i));
        }
    }
}