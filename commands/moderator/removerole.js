exports.settings = {command: "removerole", description: "Remove a role from a specified memmber in this guild.", usage: "removerole (user) (role)",
	aliases: ["rr", "rmrole", "rrole", "remover"], throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "MANAGE_ROLES"} }
	exports.run = async (client, message, args) => {
		const Find = require("./../../structures/internal/Find.js")
		const role = Find.role(args.slice(1).join(" "), message.guild)[0];
		const member = Find.member(args[0], message.guild)[0];
		const prefix = await message.guild.prefix

		if (!role) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a role under that query.`)
		if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to remove a role from. See \`${prefix}help ${this.settings.command}\` for more information.`)
		if (!role.calculatedPosition >= message.guild.me.roles.highest.calculatedPosition || !message.guild.me.hasPermission("MANAGE_ROLES")) return message.zreply(`\
${client.util.emoji("nope", message.guild)} I couldn't remove that role from that user. Make sure that my role is higher than the one you are trying \
to remove from this user.`)
		if (!member.roles.has(role.id)) return message.zreply(`${client.util.emoji("nope", message.guild)} \`${member.user.tag}\` doesn't have the \`${role.name}\` role.`)
		member.roles.remove(role, `[ ${message.author.tag} ] Using \`removerole\``).catch(c => {
			throw c;
		}).then(t => {
			message.zreply(`${client.util.emoji("ok", message.guild)} \`${member.user.tag}\` no longer has the \`${role.name}\` role.`)
		})
	}
