const Settings = require('./../structures/general/Settings.js');

exports.run = async (client, message, args) => {
	message.delete();
	if (await Settings.getValue(message.guild, "expletiveFilter") == true) {
		message.channel.send(':arrow_forward: **Expletive Filter** has been toggled off.');
		await Settings.editSetting(message.guild, "expletiveFilter", false)
	} else {
		message.channel.send(':arrow_forward: **Expletive Filter** has been toggled on.');
		await Settings.editSetting(message.guild, "expletiveFilter", true)
	}
}

let command = 'filter'
, description = 'Toggles the expletive filter on/off.'
, usage = 'filter'
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, permission: permission}
