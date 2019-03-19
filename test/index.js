const expect = require('chai').expect;
const path = require('path');
const runOnWorker = require('..');
const workerFile = path.resolve(__dirname, '_worker.js');

describe('lib: run-on-worker', function () {
  it('should run a process on a worker', async function () {
    const message = [ 1, 2, 3 ];
    const response = await runOnWorker(workerFile, message);
    expect(response).to.deep.equal(message);
  });

  it('should get an error response from the worker', async function () {
    const message = 'error';
    const request = runOnWorker(workerFile, message);
    await expect(request).to.eventually.be.rejected.to.include({ name: 'WorkerError', message: 'bang!!!', code: 42 });
  });

  it('should handle error on worker exit', async function () {
    const message = 'die';
    const request = runOnWorker(workerFile, message);
    await expect(request).to.eventually.be.rejected.with.property('name', 'WorkerError');
  });
});
