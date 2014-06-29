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

			socket.emit('status', { message: 'successfully connected, type `/help` for list of commands' });

			extend(socket.info, data);

			commands.execute(socket, 'join', [data.initialRoom || defaultRoom]);
		});

		socket.on('message', function (data) {
			socket.broadcast.to(socket.info.room).emit('message', {
				from: socket.info.name,
				message: data.message
			});
		});

		socket.on('command', function (command) {
			try {
				commands.execute(socket, command.name, command.args);
			} catch (error) {
				socket.emit('status', { message: error.message });
			}
		});
	});
}

module.exports = {
	start: start
};
