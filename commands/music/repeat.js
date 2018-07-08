exports.settings = {command: "repeat", description: "Repeat one song to play indefinitely, or repeat the entire queue.", usage: "repeat [queue]", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	if (!await message.guild.music.DJ(message.member)) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be a DJ to use this command.`)
	if (!message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's no song playing to repeat.`)
	if (args.join(" ") == "queue") {
		if (message.guild.music.repeat.queue) {
			message.guild.music.repeat.queue = false
			message.channel.send(`${client.util.emoji("ok", message.guild)} Queue repeat is now turned off.`)
		} else {
			message.channel.send(`${client.util.emoji("ok", message.guild)} The queue is now on repeat. When a song ends, it will be added into the queue again. Type \`${await message.guild.prefix}music repeat queue\` again to toggle off.`)
			message.guild.music.repeat.queue = true
		}
	} else if (message.guild.music.repeat.single) {
		message.guild.music.repeat.single = false
		message.channel.send(`${client.util.emoji("ok", message.guild)} Repeat is now turned off.`)
	} else {
		message.channel.send(`${client.util.emoji("ok", message.guild)} **${message.guild.music.currentSong.title}** is now on repeat. Type \`${await message.guild.prefix}repeat\` again to toggle off.`)
		message.guild.music.repeat.single = true
	}
	return
}
