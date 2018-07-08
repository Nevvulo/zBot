exports.settings = {command: "queue", description: "Shows the songs that are currently queued in this guild.", usage: "queue [page]", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const page = args[0] || ""

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

	if (!message.guild.music.queue || message.guild.music.queue.length < 1) return message.zreply(`${client.util.emoji("empty", message.guild)} There are currently no songs \
in the queue. You can add something to the queue by using \`${await message.guild.prefix}music (search query | url | playlist:(playlist name/id))\`.`)
	const queueArr = []
	message.guild.music.queue.forEach((song, i) => {
		queueArr.push(`\`${i+1}.\` **${song.title}**\n*Requested by \`${song.requester.tag}\`*${song.duration > 0 ? ` ─ \`${convertTime(song.duration)}\`` : ""}`)
	})
	if (queueArr.length < 1) return message.zreply(`${client.util.emoji("empty", message.guild)} There are currently no songs in the queue. You can add something to the queue by using \`${await message.guild.prefix}music (search query | url | playlist:(playlist name/id))\`.`)
	new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(queueArr, {title: `Queue » ${message.guild.name}`, author: message.guild.iconURL(), type: "Queued Songs", color: "66bb6a", description: `${client.util.emoji("ok", message.guild)} These are the songs that are currently queued in **${message.guild.name}**.\nYou can use \`${
		await message.guild.prefix}${this.settings.command} [page]\` to see another page of the queue.`, pageLength: 5, delimiter: "\n\n", footer: {text: "zBot Music Player", avatar: "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/music.png"}}, message, page)
}
