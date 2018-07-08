exports.settings = {command: "unhoist", description: "Removes any special characters from everyone in the server.", usage: "unhoist",
throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "MANAGE_NICKNAMES"}}
exports.run = async (client, message, args) => {
	const prefix = await message.guild.prefix
	const Discord = require("discord.js")
	const Punish = require("./../../structures/moderation/Punish.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const muteRole = await Settings.getValue(message.guild, "muteRole")

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	await message.guild.members.fetch();
    const hoisters = message.guild.members.filter(u => {
      const username = u.nickname || u.user.username;
      return username.toLowerCase().codePointAt(0) < 48; // codepoint of '0'
    }).array();

    if (!hoisters[0]) return message.zreply(`${client.util.emoji("empty", message.guild)} I couldn't find any hoisters.`)
		const failed = [];
		let done;
		const next = Number(1100*hoisters.length);
		const hours = Math.floor(next / 3600000);
		const minutes = Math.floor((next / 60000) - (hours * 60));
		const seconds = Math.floor((next / 1000) - ((hours * 3600) + (minutes * 60)));

		const timeArr = [{ type: {singular: "hour", plural: "hours"}, amount: hours },
										 { type: {singular: "minute", plural: "minutes"}, amount: minutes },
										 { type: {singular: "second", plural: "seconds"}, amount: seconds } ];
	 	let properArr = [];
	 	for (let i in timeArr) {
	 		if (timeArr[i].amount < 1) continue;
	 		properArr.push(`${timeArr[i].amount} ${timeArr[i].amount == 1 ? timeArr[i].type.singular : timeArr[i].type.plural}`)
	 	}
	 	let timeLeft = properArr.slice(0, -2).join(', ') + (properArr.slice(0, -2).length ? ', ' : '') + properArr.slice(-2).join(' and ');

    message.channel.zend(`${client.util.emoji("info", message.guild)} Unhoisting \`${hoisters.length}\` members. \
Please be patient, this may take some time. I will ping you once I'm finished!
\`ETA ─ ${timeLeft}\``).then(m => { done = m });
    for (const hoister of hoisters) {
			hoister.setNickname("Hoister").catch(e => {
					console.log(e)
					failed.push(hoister.username)
      });
      await sleep(1100);
    }

    done.edit(`${client.util.emoji("ok", message.guild)} ${message.author} I've finished unhoisting \`${hoisters.length}\` members!`)
		if (failed.length > 0) message.channel.zend(`${client.util.emoji("empty", message.guild)} I failed to unhoist \`${failed.length}\` members.`)
}
