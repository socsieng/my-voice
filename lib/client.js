function connect (name, endpoint, options) {
	var readline = require('readline');
	var spawn = require('child_process').spawn;
	var socket = require('socket.io-client')(endpoint, { reconnection: false });
	var colors = require('colors');
	var commandParser = require('./command-parser');

	function say (message) {
		spawn('say', [message]);
	}

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.setPrompt('', 0);

	rl.on('line', function (l) {
		var command = commandParser.parse(l);

		if (command) {
			socket.emit('command', command);
		} else if (l && l.trim()) {
			if (options.echo) {
				say(l);
			}
			socket.emit('message', {
				message: l
			});
		}
	});

	rl.on('close', function () {
		socket.disconnect();
	});

	socket.on('connect', function () {
		socket.emit('info', {
			name: name,
			version: options.version,
			platform: options.platform
		});

		rl.prompt(true);
	});

	socket.on('connect_error', function () {
		console.log('unable to connect'.red);
		rl.close();
	});

	socket.on('connect_timeout', function () {
		console.log('connection timed out'.red);
		rl.close();
	});

	socket.on('disconnect', function () {
		console.log('disconnected'.grey);
		rl.close();
	});

	socket.on('status', function (data) {
		console.log(data.message.grey);
	});

	socket.on('message', function (data) {
		console.log('%s: %s'.yellow.bold, data.from, data.message);
		say(data.message);
	});
}

module.exports = {
	connect: connect
};
