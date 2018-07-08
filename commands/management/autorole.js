exports.settings = {command: "autorole", description: "Allows you to add roles to automatically be added after a user reaches or surpasses a certain level in zBot.",
	usage: ["autorole add (level number | join) [true | false] (role name)", "autorole remove (level number | join) (role name)", "autorole list"], throttle: {usages: 3, duration: 10},
	permission: {command: "admin", user: "MANAGE_GUILD"}, example: "autorole add 25 Awesome Guy\nThis will automatically add the role *Awesome Guy* after any user reaches level *25*.",
	info: "Argument 3 `[true / false]` in this command determines whether or not the autorole should be removed after the user is no longer the specified level. This is false by default, and is optional." }
exports.run = async (client, message, args) => {
	const Guild = require("./../../models/guild/Guild.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")

	const subcommand = args[0] || ""
	const secondsubcommand = args[1] || ""
	const thirdsubcommand = args[2] || ""
	const fourthsubcommand = (thirdsubcommand !== "true" ? (thirdsubcommand !== "false" ? args.slice(2).join(" ") : args.slice(3).join(" ")) : args.slice(3).join(
		" "))
	const prefix = await message.guild.prefix

	if (subcommand == "") return message.zreply(`${client.util.emoji("nope", message.guild)
	} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)

	if (subcommand == "list") {
		const gid = message.guild.id
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		const autoroles = guild.get("autoroles").roles

		const autoroleArr = []
		for (const autorole in autoroles) {
			const autoroleObj = autoroles[autorole]
			let msg = `**${autoroleObj.role.name}** ── Level **${autoroleObj.level}**`
			if (autoroleObj.removeOnLevelChange) msg += ` ─ Removed once user is no longer level **${autoroleObj.level}**`
			if (autoroleObj.onJoin) msg = `**${autoroleObj.role.name}** ─ Added whenever someone joins this guild`
			autoroleArr.push(msg)
		}

		if (autoroleArr.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)
		} There are no autoroles on this server. You can use \`${await Settings.getValue(message.guild, "prefix")
		}autorole add (level) (role)\` to add one.`)
		new(require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(autoroleArr, {
			title: `Autoroles » ${message.guild.name}`,
			author: message.guild.iconURL(),
			type: `Autoroles in ${message.guild.name}`,
			color: "64b5f6",
			description: `${client.util.emoji("ok", message.guild)} Here are all of the autoroles in **${message.guild.name
			}**. To add an autorole, type \`${await Settings.getValue(message.guild, "prefix")}autorole add [level] [role]\`.`,
			pageLength: 10,
			delimiter: "\n"
		}, message, secondsubcommand)
	}

	const gid = message.guild.id
	const guild = await Guild.findOne({ where: { id: gid } })
	if (guild == null) return false
	const autoroles = guild.get("autoroles").roles

	async function createAutorole(role) {
		autoroles.push(role)
		const changed = await message.guild.update("autoroles", { roles: autoroles })
		return changed
	}

	async function removeAllAutoroles(number, type) {
		let index = 0
		for (const i in autoroles) {
			switch (type) {
			case "level":
				if (autoroles[i].level == number) index = i
				autoroles.splice(index, 1)
				break
			case "join":
				if (autoroles[i].onJoin) index = i
				autoroles.splice(index, 1)
				break
			default:
				if (autoroles[i].role.id == number) index = i
				autoroles.splice(index, 1)
				break
			}
		}
		const changed = await message.guild.update("autoroles", { roles: autoroles })
		return changed
	}

	async function removeAutorole(role, number, type) {
		let index = 0
		for (const i in autoroles) {
			switch (type) {
			case "level":
				if (autoroles[i].level == number && autoroles[i].role.id == role) index = i
				break
			case "join":
				if (autoroles[i].onJoin && autoroles[i].role.id == role) index = i
				break
			default:
				if (autoroles[i].role.id == role) index = i
				break
			}
		}
		autoroles.splice(index, 1)
		const changed = await message.guild.update("autoroles", { roles: autoroles })
		return changed
	}

	if (subcommand == "add") {
		let checkJoinOverload = 0
		for (const autorole in autoroles) {
			const autoroleObj = autoroles[autorole]
			if (autoroleObj.onJoin) checkJoinOverload++
		}

		if (checkJoinOverload > 2) return message.zreply(`${client.util.emoji("nope", message.guild)
		} You can't create more than 2 autoroles with the \`join\` attribute.`)
		let level = secondsubcommand
		const removeOnLevelChange = (thirdsubcommand == "true" ? true : false)
		const onJoin = ((level == "join" || Number(level) < 0) ? true : false)
		if (isNaN(Number(level)) && level !== "join") return message.zreply(`${client.util.emoji("nope", message.guild)
		} You need to provide a valid level number to set to this autorole.`)

		const role = Find.role(fourthsubcommand, message.guild)[0]
		if (!role) return message.channel.zend(`${client.util.emoji("nope", message.guild)
		} That role doesn't exist. Please enter the name of a role (ex. Moderator) and try again.`)
		level = (isNaN(Number(level)) ? 0 : Number(level))
		await createAutorole({
			role: { name: role.name, id: role.id },
			level: level,
			removeOnLevelChange: removeOnLevelChange,
			onJoin: onJoin
		})

		if (secondsubcommand !== "join") return message.channel.zend(`${client.util.emoji("ok", message.guild)} **${role.name
		}** will now automatically be applied to any user who reaches level **${level}**.`)
		return message.channel.zend(`${client.util.emoji("ok", message.guild)} **${role.name
		}** will now automatically be applied to any new users who join this guild.`)
	}

	if (subcommand == "remove") {
		if (!fourthsubcommand) {
			if (secondsubcommand == "") return message.zreply(`${client.util.emoji("nope", message.guild)
			} You need to provide a valid level number or role to remove a specific autorole.`)
			if (isNaN(secondsubcommand) && secondsubcommand !== "join") return message.zreply(`${client.util.emoji("nope", message.guild)
			} You need to provide a valid level to remove a specific autorole.`)
			if (!isNaN(secondsubcommand) || secondsubcommand == "join") {
				if (secondsubcommand == "join") {
					removeAllAutoroles(-1, "join")
					message.channel.zend(`${client.util.emoji("ok", message.guild)
					} **Any roles applied when a user joins this guild** will no longer be applied when a user joins this guild.`)
				} else {
					removeAllAutoroles(secondsubcommand, "level")
					message.channel.zend(`${client.util.emoji("ok", message.guild)} **Any roles applied on level ${secondsubcommand
					}** will no longer be applied when a user reaches level **${secondsubcommand}**.`)
				}
				return
			}
		} else {
			if (!message.guild.roles.exists("name", fourthsubcommand)) return message.zreply(`${client.util.emoji("nope", message.guild)
			} You need to provide a valid role to remove a specific autorole.`)
			if (isNaN(secondsubcommand) && secondsubcommand !== "join") return message.zreply(`${client.util.emoji("nope", message.guild)
			} You need to provide a valid level to remove a specific autorole.`)
			if (message.guild.roles.exists("name", fourthsubcommand)) {
				const role = message.guild.roles.find("name", fourthsubcommand)
				if (secondsubcommand == "join") {
					removeAutorole(fourthsubcommand.id, -1, "join")
					message.channel.zend(`${client.util.emoji("ok", message.guild)} **${role.name
					}** will no longer be applied when a user joins this guild.`)
				} else {
					removeAutorole(fourthsubcommand.id, secondsubcommand, "level")
					message.channel.zend(`${client.util.emoji("ok", message.guild)} **${role.name
					}** will no longer be applied when a user reaches level **${secondsubcommand}**.`)
				}
				return
			}
		}
	}
}
