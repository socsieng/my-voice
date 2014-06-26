var program = require('commander');

program.version('0.0.1')
	.usage('<name> [endpoint]');

program.command('server')
	.description('create a voice chat server')
	.option('-p, --port <portNumber>', 'port to listen to [80]', '80')
	.action(function (cmd) {
		var server = require('./lib/server');
		server.start(cmd.port);
	});

program.command('*')
	.description('connect to a voice chat server')
	.usage('<name> [endpoint]')
	.action(function (name, endpoint, cmd) {
		var client = require('./lib/client');
		client.connect(name, typeof endpoint === 'string' ? endpoint : 'http://soc-node.cloudapp.net/');
	});


program.parse(process.argv);
