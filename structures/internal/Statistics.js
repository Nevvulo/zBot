const Discord = require('discord.js');
const Settings = require('./../general/Settings.js')
	api = new (require("./../../data/main/keys/keys.js"))();
const fs = require('fs')
const snekfetch = require('snekfetch')

class Statistics {
	static async pingUptime() {
		//stub
	}

	static async pollUpvotes() {
			const client = require("./../../bot.js").eval(1, "client")
			let upvotes = [];
			const votes = await snekfetch.get(`https://zbot.me/api/v1/upvotes`)
		  .set('Authorization', api.zbot)
			client.util.log('Grabbed upvotes from zbot.me')
			for (let i in votes.body) { if (votes.body[i].userID && !upvotes.includes(votes.body[i].userID)) { upvotes.push(votes.body[i].userID) } }
			client.upvoters = upvotes;
	}

	static async zBotUpvotes() {
		const client = require("./../../bot.js").eval(1, "client")
			let upvotes = [];
			const votes = await snekfetch.get(`https://zbot.me/api/v1/upvotes`)
		  .set('Authorization', api.zbot)
			client.util.log('Grabbed upvotes from zbot.me')
			for (let i in votes.body) {
				if (votes.body[i].userID && !upvotes.includes(votes.body[i].userID)) { upvotes.push(votes.body[i].userID) }
			}
			client.upvoters = upvotes;
			return upvotes;
	}

	static async zBotStats(type, value) {
		const client = require("./../../bot.js").eval(1, "client")
			const votes = await snekfetch.post(`https://zbot.me/api/v1/statistics`)
		  .set('Authorization', api.zbot)
			.send({ [type]: value })
			.then(client.util.log('Updated ' + type + ' on zBot statistics API', "success"))
		  .catch(e => client.util.log('Unable to update zBot statistics API status. ' + e, "critical"));
	}

	static sendBotListingData(client) {
		const client = require("./../../bot.js").eval(1, "client")
		const guilds = require("./../../bot.js").broadcastEval("client.guilds.size").join();
		const messages = require("./../../bot.js").broadcastEval("client.messages.total").join();
		const characters = require("./../../bot.js").broadcastEval("client.messages.characters").join();
		const deleted = require("./../../bot.js").broadcastEval("client.messages.deleted").join();
		const edited = require("./../../bot.js").broadcastEval("client.messages.edited").join();
		const channels = require("./../../bot.js").broadcastEval("client.channels.size").join();
		const users = require("./../../bot.js").broadcastEval("client.users.size").join();
		const players = require("./../../bot.js").broadcastEval("client.lavalink.size").join();
		snekfetch.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
		.set('Authorization', api.dbpw)
    .send({ server_count: guilds })
		.then(client.util.log('Updated bots.discord.pw status.', "success"))
	  .catch(e => client.util.log('Unable to update bots.discord.pw status. ' + e, "critical"));

		snekfetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
		.set('Authorization', api.dbot)
    .send({ server_count: guilds })
		.then(client.util.log('Updated discordbots.org status.', "success"))
	  .catch(e => client.util.log('Unable to update discordbots.org status. ' + e, "critical"));

		snekfetch.post(`https://botsfordiscord.com/api/v1/bots/${client.user.id}`)
		.set('Authorization', api.bfd)
    .send({ server_count: guilds })
		.then(client.util.log('Updated botsfordiscord.com status.', "success"))
	  .catch(e => client.util.log('Unable to update botsfordiscord.com status. ' + e, "critical"));

		snekfetch.post(`https://botlist.space/api/bots/${client.user.id}`)
		.set('Authorization', api.bls)
    .send({ server_count: guilds })
		.then(client.util.log('Updated botlist.space status.', "success"))
	  .catch(e => client.util.log('Unable to update botlist.space status. ' + e, "critical"));

		snekfetch.post(`https://discord.services/api/bots/${client.user.id}`)
		.set('Authorization', api.ds)
    .send({ server_count: guilds })
		.then(client.util.log('Updated discord.services status.', "success"))
	  .catch(e => client.util.log('Unable to update discord.services status. ' + e, "critical"));

		snekfetch.post(`https://zbot.me/api/v1/statistics`)
		.set('Authorization', api.zbot)
    .send({ type: ["serverCount", "messages", "characters", "messagesDeleted", "messagesEdited", "channels", "users", "voiceConnections", "uptime"], value: [guilds, messages, characters,
			deleted, edited, channels, users, lavalink, process.uptime()] })
		.then(client.util.log('Updated zbot.me status.', "success"))
	  .catch(e => client.util.log('Unable to update zbot.me status. ' + e, "critical"));
	}

	static updateRates() {
		const client = require("./../../bot.js").eval(1, "client")
		snekfetch.get("http://api.fixer.io/latest")
		.set('Accept', "application/json")
		.then(res => {
			var contents = JSON.stringify(res.text, null, 4);
      fs.writeFile("./data/math/Money.json", contents, "utf8", function(error) {
          if (error) {
              client.util.log("Failed to save Money.json!\n" + error.stack, "critical");
          }
      });
});
}
}

module.exports = Statistics;
