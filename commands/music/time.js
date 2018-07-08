exports.settings = {command: "time", description: "View the amount of time this song has currently been playing for.", usage: "time", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message) => {
	function convertTime(milliseconds) {
		milliseconds = milliseconds / 1000
		const truncSeconds = Math.floor(milliseconds % 60)
		const min = Math.floor(milliseconds / 60)
		let timeString
		if (truncSeconds < 10) {
			timeString = `${min}:0${truncSeconds}`
		} else {
			timeString = `${min}:${truncSeconds}`
		}
		return timeString
	}

	if (!message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's no song playing at the moment.`)
	if (message.guild.music.currentSong.stream) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't view the time on a livestream.`)
	return message.zreply(`${client.util.emoji("ok", message.guild)} __**${message.guild.music.currentSong.title}**__ | \`${convertTime(message.guild.music.player.state.position)} / \
${convertTime(message.guild.music.currentSong.duration)}\``)
}
