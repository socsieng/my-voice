var objUtil = require('../util/object');

module.exports = function Help (io, commands) {
	function pad(str, length) {
		while (str.length < length) {
			str = str + ' ';
		}
		return str;
	}

	function formatHelp (commands) {
		var list = objUtil.toArray(commands).map(function (c) { return { cmd: ('/' + c.key + ' ' + (c.value.usage || '')).trim(), description: c.value.description }; });
		var maxLength = list.reduce(function (current, item) {
			return Math.max(current, item.cmd.length);
		}, 0);
		return list.map(function (c) { return pad(c.cmd, maxLength + 2) + c.description; }).sort().join('\n');
	}

	function executeHelp () {
		this.emit('status', { message: formatHelp(commands) });
	}

	return executeHelp;
};
