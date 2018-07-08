exports.settings = {command: "stop", description: "Stops playing the current song and leaves your voice channel.", usage: "stop", throttle: {usages: 4, duration: 10}}
exports.run = async (client, message) => {
	const isMod = await message.member.permission("MANAGE_MESSAGES")

	if (!await message.guild.music.DJ(message.member)) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be a DJ to use this command.`)
	if (!message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's nothing playing to end.`)
	const player = await client.lavalink.get(message.guild.id);
	const memberCountnb = message.guild.channels.get(player.channel).members.filter(a => !a.user.bot).array().length
	if (memberCountnb < 2 || isMod || await message.guild.music.DJ(message.member)) {
		message.guild.music.destroy()
		return message.channel.send(`${client.util.emoji("info", message.guild)} **MUSIC**: Music has stopped because **${message.author.tag}** has cleared the queue.`)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} You can't do that, there are other people in this channel listening to the music!`)
	}
}
