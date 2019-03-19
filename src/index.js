const cluster = require('cluster');
const errorEx = require('error-ex');

const WorkerError = errorEx('WorkerError');

module.exports = runOnWorker;

/**
 * Run a process on a worker and return the results.
 *
 * The worker will receive a JSON stringified message object and should return
 * a JSON stringified { response: 'what you want returned' } object. If there
 * is an error response that can be returned with a JSON stringified
 * { error: { message, code } } object instead.
 *
 * @param {string} workerFile file to run as the worker process
 * @param {*] message anything that can be JSON stringified to be went to the
 *   worker process.
 * @returns {*} JSON.parsed response from the worker
 * @throws WorkerError
 */
async function runOnWorker (workerFile, message) {
  if (!cluster.isMaster) return;
  cluster.setupMaster({ exec: workerFile });
  return new Promise((resolve, reject) => {
    const worker = cluster.fork();
    worker.once('message', message => {
      const { error, response } = JSON.parse(message);
      if (error) {
        const err = new WorkerError(error.message);
        if (error.code) err.code = error.code;
        return reject(err);
      }
      resolve(response);
    });
    worker.once('exit', code => {
      if (code !== 0) reject(new WorkerError(`worker exited with code: ${code}`));
    });
    worker.send(JSON.stringify(message));
  });
}
