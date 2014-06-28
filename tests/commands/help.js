var expect = require('expect.js');
var sinon = require('sinon');

describe('help command', function () {
	var io;
	var socket;
	var commands = {
		help: {
			description: 'display this help text'
		},
		something: {
			description: 'do something',
			usage: '[optional]'
		},
		other: {
			description: 'do something else',
			usage: '<required>'
		}
	};

	beforeEach(function () {
		io = {};

		socket = {
			emit: sinon.spy()
		};
	});

	afterEach(function () {
		io = null;
		socket = null;
	});

	describe('execute help', function () {
		it('should send and format help message', function () {
			var command = require('../../lib/commands/help')(io, commands);
			command.call(socket);

			expect(socket.emit.callCount).to.be(1);
			expect(socket.emit.args[0]).to.eql(['status', {
				message: '/help                  display this help text\n/other <required>      do something else\n/something [optional]  do something'
			}]);
		});
	});
});
