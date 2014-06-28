var expression = /^\s*\/(\w+)(.*)$/;

function parseCommand (text) {
	var match = expression.exec(text);
	if (match) {
		var command = match[1];
		var args = match[2].split(/\s+/).filter(function (item) {
			return item;
		});

		return {
			name: command.toLowerCase(),
			args: args
		};
	}
	return null;
}

module.exports = {
	parse: parseCommand
};
