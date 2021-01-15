const cluster = require('cluster');
const { deserializeError } = require('serialize-error');

module.exports = runOnWorker;

/**
 * Run a process on a worker and return the results.
 *
 * The worker will receive a JSON stringified message object and should return
 * a JSON stringified response `{ response }` or `{ error }` object. If an
 * onProgress function is provided, it will recieve info sent back from the
 * worker via a stringified `{ progress }` object.
 *
 * If an error is returned it will be automatically converted into an Error
 * using the deserialise function provided in the `serialize-error` module. The
 * worker can also use the `serialize-error` module to serialise errors to be
 * returned.
 *
 * @param {string} workerFile file to run as the worker process
 * @param {*} message anything that can be JSON stringified to be went to the
 *   worker process.
 * @returns {*} JSON.parsed response from the worker
 * @throws Error
 */
async function runOnWorker (workerFile, message, onProgress = () => {}) {
  if (!cluster.isMaster) return;
  cluster.setupMaster({ exec: workerFile });
  return new Promise((resolve, reject) => {
    const worker = cluster.fork();
    worker.on('message', message => {
      const { error, response, progress } = JSON.parse(message);
      if (error) {
        reject(deserializeError(error));
      } else if (progress) {
        onProgress(progress);
        return;
      } else {
        resolve(response);
      }
      // gracefully exit the worker if it hasn't done so itself.
      worker.kill();
    });
    worker.once('exit', code => {
      if (code !== 0) reject(new Error(`worker exited with code: ${code}`));
    });
    worker.send(JSON.stringify(message));
  });
}
