process.once('message', onMessageHandler);
async function onMessageHandler (request) {
  const message = JSON.parse(request);
  switch (message) {
    case 'error':
      process.send(JSON.stringify({ error: { name: 'CustomError', message: 'bang!!!', code: 42 } }));
      break;
    case 'die':
      process.exit(1);
    default:
      process.send(JSON.stringify({ progress: 42 }));
      process.send(JSON.stringify({ progress: 43 }));
      process.send(JSON.stringify({ response: message }));
      break;
  }
}
