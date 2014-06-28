function toArray (obj) {
	var props = Object.getOwnPropertyNames(obj);

	return props.map(function (prop) {
		return {
			key: prop,
			value: obj[prop]
		};
	});
}

module.exports = {
	toArray: toArray
};
