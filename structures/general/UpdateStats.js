const Discord = require('discord.js');
const Version = require('./Version.js');
const Settings = require('./Settings.js')
const api = require('./../../data/main/keys/keys.js')

class UpdateStats {
	static updateDBL() {
		const snekfetch = require('snekfetch')

	snekfetch.post('https://discordbots.org/api/bots/345766303052857344/stats')

	  .set('Authorization', api.dbot())
	  .send({ server_count: client.guilds.size })
	  .then(log('Updated discordbots.org status.', logType.info))
	  .catch(e => log('Unable to update discordbots.org status. ' + e, logType.critical));
		return;
		}

	static updateDLB() {
		const snekfetch = require('snekfetch')
		snekfetch.post('https://bots.discordlist.net/api')
		.send({ token: api.dlb() })
		.send({ servers: client.guilds.size })
		.then(log('Updated bots.discordlist.net status.', logType.info))
	  .catch(e => log('Unable to update bots.discordlist.net status. ' + e, logType.critical));
		return;
	}
}

module.exports = UpdateStats;
