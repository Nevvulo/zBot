exports.settings = {command: "unmute", description: "Unmute a user with the muted role from this server.", usage: "unmute (user)", throttle: {usages: 3, duration: 10},
	permission: {command: "mod", user: "MUTE_MEMBERS"}, info: "The muted role is the role you set as `muteRole` in your configuration."}
exports.run = async (client, message, args) => {
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter the name of the member you want to unmute. Type \`${prefix}help ${this.settings.command}\` for more information.`)
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const muteRole = await Settings.getValue(message.guild, "muteRole")
	const member = Find.member(args.slice(0).join(" "), message.guild)[0]

	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)
	if (!message.guild.roles.has(muteRole) || !muteRole) return message.zreply(`${client.util.emoji("nope", message.guild)} The server owner hasn't set the \`muteRole\` setting to a valid role. You can use \`${prefix}config set muteRole [role name]\` to set the muted role.` )
	if (!member.roles.has(muteRole)) return message.zreply(`${client.util.emoji("nope", message.guild)} This user isn't muted!`)
	member.roles.remove(muteRole).catch(() => {
		return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to unmute this person.`)
	})
	return message.zreply(`${client.util.emoji("ok", message.guild)} \`${member.user.tag}\` (${member.user.id}) has been **unmuted**.`)
}
