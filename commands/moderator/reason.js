exports.settings = {command: "reason", description: "When you perform a punishment on someone, a case number is assigned to that punishment. Using this command, you can edit a punishment case's reason after you've created it.",
usage: "reason (case number) (reason)", throttle: {usages: 3, duration: 10}, aliases: ["r", "re", "rsn"],	 permission: {command: "mod", user: "MANAGE_MESSAGES"}}
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Punish = require("./../../structures/moderation/Punish.js")

	const prefix = await Settings.getValue(message.guild, "prefix")
	const CASE = args[0];
	const reason = args.slice(1).join(' ')

	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a punishment case to modify. See \`${prefix}help ${this.settings.command}\` for more information.`)
	if (!reason) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a reason for this case. See \`${prefix}help ${this.settings.command}\` for more information.`)
	
	let caseObj;

	Punish.editPunish(CASE, message.guild, message.author, (reason.length > 1024 ? `${reason.substr(0, 1019)}...` : reason))
	message.zreply(`${client.util.emoji("ok", message.guild)} ${caseObj ? `Cases \`${caseObj[0]}\` to \`${caseObj[caseObj.length-1]}\` were` : `Case \`${CASE}\` was`} successfully edited.`)
}
