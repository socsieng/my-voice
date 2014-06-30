var program = require('commander');

program.version('0.0.7'); // automatically updated from package.json

program.command('connect')
	.description('connect to a voice chat server')
	.usage('<nickname> [endpoint] [options]')
	.option('-e, --echo', 'enable speech for your own messages')
	.action(function (name, endpoint, cmd) {
		var client = require('./lib/client');

		if (typeof endpoint !== 'string') {
			cmd = endpoint;
			endpoint = 'http://soc-node.cloudapp.net/';
		}

		var options = {
			version: program.version(),
			platform: process.platform,
			echo: cmd.echo
		};

		client.connect(name, endpoint, options);
	});

program.command('say')
	.description('convert text to speech locally')
	.action(function () {
		require('./lib/say');
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
