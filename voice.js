var readline = require('readline');
var spawn = require('child_process').spawn

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt('', 0);

rl.prompt(true);

rl.on('line', function (l) {
	if (l && l.trim()) {
		spawn('say', [l]);
	}
});