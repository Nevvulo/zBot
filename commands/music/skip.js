exports.settings = {command: "skip", description: "Skips the current song if there is one playing.", usage: "skip", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message) => {
	const voiceChannel = message.member.voiceChannel
	const isMod = await message.member.permission("MANAGE_MESSAGES")
	
	if (!await message.guild.music.DJ(message.member)) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be a DJ to use this command.`)
	if (!message.guild.music.playing) return message.zreply(`${client.util.emoji("nope", message.guild)} There's nothing to skip.`)
	if (!voiceChannel) return message.zreply(`${client.util.emoji("nope", message.guild)} You aren't currently in a voice channel.`)
	if (voiceChannel.id !== message.guild.me.voiceChannel.id) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to be in the same voice channel as me to skip songs!`)
	const memberCountnb = message.guild.music.voiceChannel.members.filter(a => !a.user.bot).array().length

	const song = message.guild.music.queue[0];
	if (isMod || await message.guild.music.DJ(message.member)) {
		message.channel.send(`${client.util.emoji("ok", message.guild)} \`${message.member.displayName}\` skipped \`${message.guild.music.currentSong.title}\`.`)
		return message.guild.music.skip(true);
	}

	if (song.skips.size < Math.round(memberCountnb / 2)) {
		if (song.skips.has(message.author.id)) return message.zreply(`${client.util.emoji("nope", message.guild)} You've already voted to skip!`)
		song.skips.add(message.author.id);
		return message.channel.send(`${client.util.emoji("ok", message.guild)} \`${message.member.displayName}\` has voted to skip the current song. \
\`${Math.round((memberCountnb / 2) - song.skips.size)}\` more vote(s) are required in order to skip.`)
	} else if (song.skips.size >= Math.round(memberCountnb / 2)) {
		message.channel.send(`${client.util.emoji("ok", message.guild)} The skip vote passed, and \`${message.guild.music.currentSong.title}\` was skipped.`)
		return message.guild.music.skip(true);
	}
}
