# Run On Worker [![Build Status](https://api.travis-ci.com/noblesamurai/node-run-on-worker.svg?branch=master)](http://travis-ci.com/noblesamurai/node-run-on-worker) [![Maintainability](https://api.codeclimate.com/v1/badges/8eedb3b307882391272e/maintainability)](https://codeclimate.com/github/noblesamurai/node-run-on-worker/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/8eedb3b307882391272e/test_coverage)](https://codeclimate.com/github/noblesamurai/node-run-on-worker/test_coverage)

> Run a node.js module in a separate process using cluster.

## Installation

This module is installed via npm:

``` bash
$ npm install run-on-worker
```

## Usage

```js
// worker.js
process.once('uncaughtException', process.exit.bind(process, 1));
process.once('unhandledRejection', process.exit.bind(process, 1));
process.once('message', request => {
  try {
    const message = JSON.parse(request);
    const response = message.reduce((acc, n) => acc + n, 0);
    process.send(JSON.stringify({ response }));
  } catch (err) {
    process.send(JSON.stringify({ error: { message: err.message, code: 42 } }));
  }
  process.exit();
});

// main.js
async function sum (values) {
  const workerFile = path.resolve(__dirname, 'worker.js');
  return runOnWorker(workerFile, values);
}

try {
  const result = await sum([ 2, 3, 6 ]); // 11
} catch (err) {
}
```

## API

<a name="runOnWorker"></a>

## runOnWorker(workerFile, message, onProgress) ⇒ <code>\*</code>
Run a process on a worker and return the results.

The worker will receive a JSON stringified message object and should return
a JSON stringified { response: 'what you want returned' } object. If there
is an error response that can be returned with a JSON stringified
{ error: { message, code } } object instead.

If you provided an onProgress function, it will get anything the worker sends back thusly:
```js
process.send(JSON.stringify({ progress: data }));
```

**Kind**: global function
**Returns**: <code>\*</code> - JSON.parsed response from the worker
**Throws**:

- WorkerError


| Param | Type | Description |
| --- | --- | --- |
| workerFile | <code>string</code> | file to run as the worker process |
| message | <code>\*</code> | anything that can be JSON stringified to be went to the   worker process. |

Note: To regenerate this section from the jsdoc run `npm run docs` and paste
the output above.

## License

The BSD License

Copyright (c) 2019, Andrew Harris.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the Andrew Harris. nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
