var app = require('http').createServer(function (req, res) {
	res.end('coming soon');
});

var io = require('socket.io')(app);

function start(port) {
	app.listen(port);
	console.log('listening on port %s', port);

	io.on('connection', function (socket) {
		console.log('connected: %s', socket.id);
		socket.info = { name: 'anonymous' };

		socket.on('info', function (data) {
			socket.info = data;

			socket.broadcast.emit('status', {
				from: socket.info.name,
				message: 'connected'
			});
		});

		socket.on('message', function (data) {
			socket.broadcast.emit('message', {
				from: socket.info.name,
				message: data.message
			});
		});
	});
}

module.exports = {
	start: start
};
