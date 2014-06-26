function connect (name, endpoint) {
  var readline = require('readline');
  var spawn = require('child_process').spawn

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('', 0);

  rl.prompt(true);

  rl.on('line', function (l) {
    if (l && l.trim()) {
      socket.emit('message', {
        message: l
      });
    }
  });

  var socket = require('socket.io-client')(endpoint);

  socket.on('connect', function () {
    console.log('connected');
    socket.emit('info', {
      name: name
    });
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
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
