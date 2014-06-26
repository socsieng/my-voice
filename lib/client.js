function connect (name, endpoint) {
  var readline = require('readline');
  var spawn = require('child_process').spawn
  var socket = require('socket.io-client')(endpoint, { reconnection: false });

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('', 0);

  rl.on('line', function (l) {
    if (l && l.trim()) {
      socket.emit('message', {
        message: l
      });
    }
  });

  rl.on('close', function () {
    socket.disconnect();
  })

  socket.on('connect', function () {
    console.log('connected');
    socket.emit('info', {
      name: name
    });

    rl.prompt(true);
  });

  socket.on('connect_error', function () {
    console.log('unable to connect');
  });

  socket.on('connect_timeout', function () {
    console.log('connection timed out');
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
    rl.close();
  });

  socket.on('status', function (data) {
    console.log('status: %s %s', data.from, data.message);
  });

  socket.on('message', function (data) {
    console.log('%s: %s', data.from, data.message);
    spawn('say', [data.message]);
  });
}

module.exports = {
  connect: connect
};
