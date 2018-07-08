exports.settings = {command: "remove", description: "Remove a song or a group of songs from the queue.", usage: "remove (index or range)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Music = require("./../../structures/general/Music.js")
	const number = args[0] || ""

	if (!await message.guild.music.DJ(message.member)) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be a DJ to use this command.`)
	if (!number) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid song index.`)
	if (message.guild.music.queue.length < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} There's nothing in the queue to remove.`)
	if (number.includes("-")) {
		const caseObj = []
		if (isNaN(parseInt(number.split("-")[0])) || isNaN(parseInt(number.split("-")[1]))) return message.zreply(`${client.util.emoji("nope", message.guild)} Your selection contains an invalid number.`)
		for (let i=parseInt(number.split("-")[0]); i <= parseInt(number.split("-")[1]); i++) {
			caseObj.push(i)
		}
		if (parseInt(number.split("-")[0]) > message.guild.music.queue.length || parseInt(number.split("-")[1]) > message.guild.music.queue.length) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided a song index that doesn't exist in the queue.`)
		message.guild.music.queue.splice(Number(Number(caseObj[0]) - 1), Number(Number(caseObj[caseObj.length-1]) - 1))
		return message.zreply(`${client.util.emoji("ok", message.guild)} You have removed \`songs ${caseObj[0]} to ${caseObj[caseObj.length-1]}\` from the queue.`)
	} else {
		if (Number(number) > message.guild.music.queue.length) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided a song index that doesn't exist in the queue.`)
		const song = message.guild.music.queue[Number(number) - 1]
		message.guild.music.queue.splice(Number(number) - 1, 1)
		return message.zreply(`${client.util.emoji("ok", message.guild)} **${song}** was removed from the queue.`)
	}
}
