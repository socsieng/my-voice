var program = require('commander');

program.version('0.0.4');

program.command('connect')
	.description('connect to a voice chat server')
	.usage('<nickname> [endpoint]')
	.action(function (name, endpoint, cmd) {
		var client = require('./lib/client');
		var options = {
			version: program.version(),
			platform: process.platform
		}
		client.connect(name, typeof endpoint === 'string' ? endpoint : 'http://soc-node.cloudapp.net/', options);
	});

program.command('echo')
	.description('convert text to speech locally')
	.action(function () {
		require('./lib/echo');
	});

program.command('server')
	.description('create a voice chat server')
	.option('-p, --port <portNumber>', 'port to listen to [80]', '80')
	.action(function (cmd) {
		var server = require('./lib/server');
		server.start(cmd.port);
	});

program.parse(process.argv);

if (program.args.length === 0) {
	program.help();
}
