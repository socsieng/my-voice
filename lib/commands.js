var objUtil = require('./util/object');

module.exports = function (io) {
	var commands;

	function executeCommand (socket, commandName, args) {
		var command = commands[commandName];

		if (command) {
			command.fn.apply(socket, args);
		} else {
			throw new Error('`' + commandName + '` command is not supported');
		}
	}

	// work-around for not having direct access to this functionality
	// http://stackoverflow.com/questions/23858604/how-to-get-rooms-clients-list-in-socket-io-1-0
	function getClientsByRoom (roomId) {
		var clients = [];
		var room = io.sockets.adapter.rooms[roomId];
		if (room) {
			for (var id in room) {
				clients.push(io.sockets.adapter.nsp.connected[id]);
			}
		}
		return clients;
	}

	function joinRoom (socket, room) {
		socket.join(room, function () {
			socket.broadcast.to(room).emit('status', {
				message: socket.info.name + ' has joined the room'
			});

			socket.emit('status', {
				message: room + ' contains ' + getClientsByRoom(room).map(function (i) { return i.info.name; }).join(', ')
			});
		});
	}

	function leaveRoom (socket, room, message) {
		socket.leave(room, function () {
			if (message) {
				socket.broadcast.to(room).emit('status', {
					from: socket.info.name,
					message: message
				});
			}
			socket.broadcast.to(room).emit('status', {
				message: socket.info.name + ' has left the room'
			});
		});
	}

	commands = {
		help: {
			description: 'display help text'
		},
		join: {
			usage: '<room>',
			description: 'join a room',
			fn: function (room) {
				var socket = this;

				if (!room || typeof room !== 'string' || arguments.length !== 1) {
					socket.emit('status', {
						message: 'Error: invalid arguments'
					});
					return;
				}

				if (socket.info.room === room) {
					return;
				}

				if (socket.info.room) {
					leaveRoom(socket, socket.info.room);
				}

				socket.info.room = room;
				joinRoom(socket, room);
			}
		},
		part: {
			description: 'leave the current room',
			fn: function (message) {
				var socket = this;
				var room = socket.info.room;

				leaveRoom(socket, room, message);
				socket.info.room = 'lobby';
				joinRoom(socket, socket.info.room);
			}
		},
		names: {
			description: 'list names in the current room',
			fn: function () {
				var socket = this;
				socket.emit('status', {
					message: getClientsByRoom(socket.info.room).map(function (i) { return i.info.name; }).join(', ')
				});
			}
		},
		list: {
			description: 'list rooms',
			fn: function () {
				var socket = this;
				var rooms = objUtil.toArray(io.sockets.adapter.rooms)
					.filter(function (r) { return !r.value[r.key]; })
					.map(function (r) { return r.key; });

				socket.emit('status', {
					message: rooms.join(', ')
				});
			}
		}
	};

	commands.help.fn = require('./commands/help')(io, commands);
	commands.leave = commands.part;

	return {
		execute: executeCommand
	};
};
