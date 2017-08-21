var expletiveFilter = true;

exports.run = (client, message, args) => {
	message.delete();
	if (expletiveFilter) {
		message.channel.send(':arrow_forward: **Expletive Filter** has been toggled off.');
		expletiveFilter = false;
	} else {
		message.channel.send(':arrow_forward: **Expletive Filter** has been toggled on.');
		expletiveFilter = true;
	}

exports.enabled = expletiveFilter;
}

let command = 'filter'
, description = 'Toggles the expletive filter on/off.'
, usage = '+filter'
, permission = 'admin'
exports.settings = {command: command, description: description, usage: usage, permission: permission}
