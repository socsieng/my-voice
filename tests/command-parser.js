var expect = require('expect.js');
var parser = require('../lib/command-parser.js');

describe('command-parser', function () {
	describe('parse', function () {
		it('should parse basic command', function () {
			var command = parser.parse('/hello');
			expect(command).to.eql({ name: 'hello', args: [] });
		});

		it('should parse basic command with arguments', function () {
			var command = parser.parse('/hello world foo bar');
			expect(command).to.eql({ name: 'hello', args: ['world', 'foo', 'bar'] });
		});

		it('should parse basic command with whitespace either side', function () {
			var command = parser.parse('  /hello  ');
			expect(command).to.eql({ name: 'hello', args: [] });
		});

		it('should parse basic command and convert command name to lower case', function () {
			var command = parser.parse('/HELLO world');
			expect(command).to.eql({ name: 'hello', args: ['world'] });
		});
	});

	describe('not parse', function () {
		it('should not parse `null`', function () {
			var command = parser.parse(null);
			expect(command).to.be(null);
		});

		it('should not parse empty string', function () {
			var command = parser.parse('');
			expect(command).to.be(null);
		});

		it('should not parse strings that don\'t start with `/`', function () {
			var command = parser.parse('hello world');
			expect(command).to.be(null);
		});
	});
});
