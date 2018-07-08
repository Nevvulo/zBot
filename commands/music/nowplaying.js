exports.settings = {command: "nowplaying", description: "Shows detailed information on the song that is currently playing.", usage: "nowplaying", throttle: {usages: 4, duration: 10} }
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

	if (!message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's nothing that's currently playing.`)
	return message.channel.zend(`${client.util.emoji("info", message.guild)} Here's some information on the song that's currently playing;\n` +
  `**NOW PLAYING** ─ \`${message.guild.music.currentSong.title}\`\n**REQUESTED BY** ─ \`${message.guild.music.currentSong.requester == undefined ? "???" : message.guild.music.currentSong.requester.tag}\`\n**LENGTH** ─ \`${convertTime(message.guild.music.currentSong.duration)}\``)
}
