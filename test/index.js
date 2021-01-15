const expect = require('chai').expect;
const path = require('path');
const runOnWorker = require('..');
const workerFile = path.resolve(__dirname, '_worker.js');
const sinon = require('sinon');

describe('lib: run-on-worker', function () {
  it('should run a process on a worker', async function () {
    const message = [1, 2, 3];
    const response = await runOnWorker(workerFile, message);
    expect(response).to.deep.equal(message);
  });

  it('should get an error response from the worker', async function () {
    const message = 'error';
    const request = runOnWorker(workerFile, message);
    await expect(request).to.eventually.be.rejected.to.include({ name: 'CustomError', message: 'bang!!!', code: 42 });
  });

  it('should emit progress updates', async function () {
    const message = { progress: 'test' };
    const progress = sinon.stub();
    const response = await runOnWorker(workerFile, message, progress);
    expect(progress).to.have.been.calledTwice();
    expect(progress.firstCall).to.have.been.calledWith(42);
    expect(progress.secondCall).to.have.been.calledWith(43);
    expect(response).to.deep.equal(message);
  });

  it('should handle error on worker exit', async function () {
    const message = 'die';
    const request = runOnWorker(workerFile, message);
    await expect(request).to.eventually.be.rejected.with.property('name', 'Error');
  });
});
