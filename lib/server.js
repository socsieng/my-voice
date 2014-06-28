var app = require('http').createServer(function (req, res) {
	res.end('coming soon');
});

var extend = require('extend');
var io = require('socket.io')(app);
var commands = require('./commands')(io);
var defaultRoom = 'lobby';

function isClientCompatible (clientInfo) {
	return !!clientInfo.version;
}

function start(port) {
	app.listen(port);
	console.log('listening on port %s', port);

	io.on('connection', function (socket) {
		socket.info = { name: 'anonymous' };

		socket.on('info', function (data) {
			if (!isClientCompatible(data)) {
				socket.emit('status', {
					message: 'client update required'
				});
				socket.disconnect();
				return;
			}

			extend(socket.info, data);

			commands.execute(socket, 'join', [data.initialRoom || defaultRoom]);
		});

		socket.on('message', function (data) {
			socket.broadcast.emit('message', {
				from: socket.info.name,
				message: data.message
			});
		});

		socket.on('command', function (command) {
			commands.execute(socket, command.name, command.args);
		});
	});
}

module.exports = {
	start: start
};
