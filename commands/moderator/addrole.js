exports.settings = {command: "addrole", description: "Add a role to a specified memmber in this guild.", usage: "addrole (user) (role)", aliases: ["ar", "arole", "addr"], throttle: {usages: 3, duration: 10},
	permission: {command: "mod", user: "MANAGE_ROLES"} }
	exports.run = async (client, message, args) => {
		const Find = require("./../../structures/internal/Find.js")
		const role = Find.role(args.slice(1).join(" "), message.guild)[0];
		const member = Find.member(args[0], message.guild)[0];
		const prefix = await message.guild.prefix

		if (!role) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a role under that query.`)
		if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to add a role to. See \`${prefix}help ${this.settings.command}\` for more information.`)
		if (!role.calculatedPosition >= message.guild.me.roles.highest.calculatedPosition || !message.guild.me.hasPermission("MANAGE_ROLES")) return message.zreply(`\
${client.util.emoji("nope", message.guild)} I couldn't add that role to this user. Make sure that my role is higher than the one you are trying \
to add to this user.`)
		if (member.roles.has(role.id)) return message.zreply(`${client.util.emoji("nope", message.guild)} \`${member.user.tag}\` already has the \`${role.name}\` role.`)
		member.roles.add(role, `[ ${message.author.tag} ] Using \`addrole\``).catch(c => {
			throw c;
		}).then(t => {
			message.zreply(`${client.util.emoji("ok", message.guild)} \`${member.user.tag}\` now has the \`${role.name}\` role.`)
		})
	}
