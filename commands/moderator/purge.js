exports.settings = {command: "purge", description: "Removes a specified amount of messages in the current channel.",
	usage: ["purge (number 1-100)", "purge (number 1-100) [invite]", "purge (number 1-100) [user (username)]", "purge (number 1-100) [bot]",
	"purge (number 1-100) [me]", "purge (number 1-100) [attachments]", "rm (number 1-100) [links]"], aliases: ["rm", "delete", "remove"],
	throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "MANAGE_MESSAGES"} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")

	const originalDeleted = await Settings.getValue(message.guild, "deleteUserCommand")
	let num = Number(args[0]) || 0
	const parameters = args[1] || ""

	const messageauthor = message.author.id
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide the number of messages you want to delete.`)
	if (!num) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid number.`)
	if (num > 500) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't delete more than 500 messages at a time.`)
	if (!originalDeleted || !message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) num++

	let messageFilter
	let msg
	if (!parameters) {
		messageFilter = message => message
		msg = ""
	} else {
		switch (parameters) {
		case "invite":
			messageFilter = mos => mos.content.search(/(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i) !== -1
			msg = " that contained any invite links"
			break
		case "user":
			const user = Find.user(args.slice(2).join(" "), true, message.guild)[0] /* eslint no-case-declarations: 0*/
			if (user) {
				messageFilter = mos => mos.author.id === user.id
				msg = ` created by \`${user.username || user.user.username}\``
			} else {
				return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)
			}
			break
		case "bot":
			messageFilter = mos => mos.author.bot
			msg = " created by bots"
			break
		case "me":
			messageFilter = mos => mos.author.id === messageauthor // because the message here is different to the message object above
			msg = " created by you"
			break
		case "attachments":
			messageFilter = mos => mos.attachments.size > 0
			msg = " that contained attachments"
			break
		case "links":
			messageFilter = mos => mos.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1  /* eslint no-useless-escape: 0*/
			msg = " that contained links"
			break
		default:
			return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid parameter or filter. Type \`help ${this.settings.command}\` for more information on filters.`)
		}
	}

	let numberDeleted = 0
	await deleteMessages(num, messageFilter, msg)

	async function deleteMessages(num, filter, filterMsg) {
		let messages
		if (num > 100) {
			messages = await message.channel.messages.fetch({ limit: 100 }).catch(err => client.util.log(err, "critical"))
		} else {
			messages = await message.channel.messages.fetch({ limit: num }).catch(err => client.util.log(err, "critical"))
		}
		const messagesToDelete = messages.filter(filter)
		if (num > 100) {
			message.channel.bulkDelete(messagesToDelete.array().reverse()).then(async function(messages) {
				numberDeleted += messages.size
				await deleteMessages(num - 100, filter, filterMsg)
			}).catch(function() {
				message.zreply(`${client.util.emoji("nope", message.guild)} There was an error deleting the messages. Make sure the messages are under 14 days old, and that I have permission to delete messages.`)
			})
		} else {
			message.channel.bulkDelete(messagesToDelete.array().reverse()).then(async function(messages) {
				numberDeleted += messages.size
				if (numberDeleted < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find any messages${msg} with the number you provided.`)
				message.channel.zend(`${client.util.emoji("ok", message.guild)} I successfully deleted **${numberDeleted}** messages${msg}.`)
			}).catch(function() {
				if (messagesToDelete.array().reverse().length == 1) {
					messagesToDelete.array().reverse()[0].delete()
					numberDeleted += 1
				}
				return message.zreply(`${client.util.emoji("nope", message.guild)} There was an error deleting the messages. Make sure the messages are under 14 days old, and that I have permission to delete messages.`)
			})
		}
	}
}
