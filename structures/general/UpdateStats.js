const Discord = require('discord.js');
const Version = require('./Version.js');
const Settings = require('./Settings.js')
const api = require('./../../data/main/keys/keys.js')

class UpdateStats {
	static updateDBL() {
		const snekfetch = require('snekfetch')

	snekfetch.post('https://discordbots.org/api/bots/345766303052857344/stats')
	  .set('Authorization', api.dbot)
	  .send({ server_count: client.guilds.size })
	  .then(log('Updated dbots.org status.', logType.info))
	  .catch(e => log('Unable to update dbots.org status. ' + e, logType.critical));

		return;
		}
}

module.exports = UpdateStats;
