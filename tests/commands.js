var expect = require('expect.js');
var sinon = require('sinon');

describe('commands', function () {
	var io;
	var socket;
	var roomBroadcast;
	var commands;

	beforeEach(function () {
		roomBroadcast = sinon.spy();
		io = {
			sockets: {
				clients: sinon.stub(),
				adapter: {
					rooms: [],
					nsp: {
						connected: {}
					}
				}
			}
		};

		socket = {
			info: {
				name: 'dude'
			},
			join: function (room, callback) {
				if (callback) {
					callback();
				}
			},
			leave: function (room, callback) {
				if (callback) {
					callback();
				}
			},
			emit: sinon.spy()
		};
		socket.broadcast = sinon.spy();
		socket.broadcast.to = sinon.stub();
		socket.broadcast.to.returns({
			emit: roomBroadcast
		});

		commands = require('../lib/commands.js')(io);
	});

	afterEach(function () {
		io = null;
		socket = null;
		roomBroadcast = null;
		commands = null;
	});

	describe('bad command', function () {
		it('should not execute a bad command', function () {
			expect(function () {
				commands.execute(socket, 'foo', []);
			}).to.throwError();
		});
	});

	describe('join', function () {
		it('should join a room', function () {
			commands.execute(socket, 'join', ['foo']);
			expect(socket.info.room).to.be('foo');
		});

		it('should not join when no room is provided', function () {
			commands.execute(socket, 'join', []);
			expect(socket.emit.calledWith('status', { message: 'Error: invalid arguments' })).to.be(true);
		});

		it('should not join when empty room is provided', function () {
			commands.execute(socket, 'join', ['']);
			expect(socket.emit.calledWith('status', { message: 'Error: invalid arguments' })).to.be(true);
		});

		it('should not join when too many arguments are provided', function () {
			commands.execute(socket, 'join', ['foo', 'bar']);
			expect(socket.emit.calledWith('status', { message: 'Error: invalid arguments' })).to.be(true);
		});

		it('should leave the current room before joining a new one', function () {
			socket.info.room = 'bar';
			commands.execute(socket, 'join', ['foo']);
			expect(roomBroadcast.callCount).to.be(2);
			expect(roomBroadcast.args[0]).to.eql(['status', { message: 'dude has left the room' }]);
			expect(roomBroadcast.args[1]).to.eql(['status', { message: 'dude has joined the room' }]);
		});

		it('should not leave the room if attempting to join the same one', function () {
			socket.info.room = 'foo';
			commands.execute(socket, 'join', ['foo']);
			expect(roomBroadcast.called).to.be(false);
		});
	});

	describe('part', function () {
		it('should leave a room with a message', function () {
			socket.info.room = 'foo';
			commands.execute(socket, 'part', ['good bye']);
			expect(roomBroadcast.callCount).to.be(3);
		});

		it('should leave a room without a message', function () {
			socket.info.room = 'foo';
			commands.execute(socket, 'part', []);
			expect(roomBroadcast.callCount).to.be(2);
		});
	});

	describe('nick', function () {
		it('should change name when the name is different', function () {
			commands.execute(socket, 'nick', ['bro']);
			expect(socket.info.name).to.be('bro');
			expect(roomBroadcast.callCount).to.be(1);
			expect(roomBroadcast.args[0]).to.eql(['status', { message: 'dude has changed their name to bro' }]);
		});

		it('should not change name when the name is the same', function () {
			commands.execute(socket, 'nick', ['dude']);
			expect(socket.info.name).to.be('dude');
			expect(roomBroadcast.callCount).to.be(0);
		});

		it('should not change name when no room is provided', function () {
			commands.execute(socket, 'nick', []);
			expect(socket.info.name).to.be('dude');
			expect(socket.emit.calledWith('status', { message: 'Error: invalid arguments' })).to.be(true);
		});
	});
});
