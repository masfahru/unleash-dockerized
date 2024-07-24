const cluster = require('node:cluster');
const { availableParallelism } = require('node:os');

if (cluster.isPrimary) {
  cluster.setupPrimary({
    exec: 'app.js',
  })
  cluster.on('exit', (worker, code, signal) => {
    if (code !== 0) {
      console.log(
        `worker ${worker.process.pid} died with code: ${code}, signal: ${signal}, starting a new worker`,
      )
    } else {
      console.log(`worker ${worker.process.pid} finished successfully`)
    }
    cluster.fork()
  })
  for (let i = 0; i < availableParallelism(); i++) {
    cluster.fork()
  }
}
