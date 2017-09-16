const sql = require('sqlite');
const Discord = require('discord.js');
sql.open('./data/user/userData.sqlite');
var limit = 5

exports.run = (client, message, args) => {
	leaderboard();
	async function leaderboard() {
		var memberCountnb = message.guild.members.filter(a => !a.user.bot).array().length;
		limit = args;
		if (args == [] || args == "") {
			limit = 5
		}

		if (limit.isNaN || limit == 0 || limit == "" || limit == NaN) {
			limit = 5;
		}

		if (limit > message.guild.memberCount) {
				limit = memberCountnb
		}

		if (limit > 10) {
		message.reply(":no_entry_sign: **NOPE:** You can't display more than 10 people at a time.");
		return;
		}

		var tosend = [];
		//SQL query in variable.
		var test = await sql.all(`SELECT * FROM experience WHERE guild = '${message.guild.id}' ORDER BY experience DESC LIMIT ${limit}`);
		//Loop through all users in query and push them to an array.
		for (let i = 0; i < limit; i++) {
			client.users.fetch(test[i].userId).then(function (member) {
				tosend.push("**" + member.username + "**  ■  *" + test[i].experience + " experience*\n");
			}).catch(function (reason) {
				throw reason;
			});
		}
		//Send array.
		await console.log();
		const embed = new Discord.MessageEmbed();
		message.channel.send({embed: {
		title: "ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ » ",
		color: 3191350,
		author: {icon_url: message.author.displayAvatarURL},
		description: ":star2: Listing the top **" + limit + "** users with the most experience.",
		fields: [
		{
		  name: '**Leaderboard**',
		  value: tosend.toString().replace(/,/g, "")
		}
		],
		timestamp: new Date()
		}});
	}
}

let command = 'leaderboard'
, description = 'Displays a leaderboard of the users with the highest ranking experience.'
, usage = 'leaderboard (number 1-10)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
