exports.settings = {command: "pause", description: "Automatically joins your voice channel and plays a specified song.", usage: "play (query | playlist:[playlist id])", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message) => {
	if (!await message.guild.music.DJ(message.member)) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be a DJ to use this command.`)
	if (!message.guild.music.currentSong || !message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's no song playing to pause.`)
	if (message.guild.music.paused) return message.zreply(`${client.util.emoji("nope", message.guild)} Playback is already paused.`)
	message.channel.send(`${client.util.emoji("ok", message.guild)} Audio playback was \`paused\` by **${message.author.username}**.`)
	return message.guild.music.pause();
}
