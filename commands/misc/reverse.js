exports.settings = {command: "reverse", description: "Reverses a string.", usage: "reverse (string)", throttle: {usages: 3, duration: 10} }
exports.run = (client, message, args) => {
	const original = args.slice(0).join(" ")
	const reverse = original.split("").reverse().join("")
	let msg = ""

	function cleanString(string) {
		return string
			.replace(/@(everyone|here)/g, "@\u200b$1")
			.replace(/<@!?[0-9]+>/g, input => {
				const id = input.replace(/<|!|>|@/g, "")
				if (message.channel.type === "dm" || message.channel.type === "group") {
					return client.users.has(id) ? `@${client.users.get(id).username}` : input
				}

				const member = message.channel.guild.members.get(id)
				if (member) {
					if (member.nickname) return `@${member.nickname}`
					return `@${member.user.username}`
				} else {
					const user = client.users.get(id)
					if (user) return `@${user.username}`
					return input
				}
			})
			.replace(/<#[0-9]+>/g, input => {
				const channel = client.channels.get(input.replace(/<|#|>/g, ""))
				if (channel) return `#${channel.name}`
				return input
			})
			.replace(/<@&[0-9]+>/g, input => {
				if (message.channel.type === "dm" || message.channel.type === "group") return input
				const role = message.guild.roles.get(input.replace(/<|@|>|&/g, ""))
				if (role) return `@${role.name}`
				return input
			})
	}

	if (reverse === original) msg = `\n${client.util.emoji("info", message.guild)} **FUN FACT**: Your phrase is a palindrome, meaning it's spelt the same way forward as it is backwards!`
	message.zreply(`${client.util.emoji("edit", message.guild)} **REVERSE**: ${cleanString(reverse)}${msg}`)
}
