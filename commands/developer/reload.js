exports.run = (client, message, args) => {
	const type = args[0]
	if (type.includes("structure")) {
		delete require.cache[require.resolve(`./../../structures/general/${args[1]}.js`)]
		message.zreply(`${client.util.emoji("ok", message.guild)} \`${args[1]}\` was reloaded.`)
	} else {
		// the path is relative to the *current folder*, so just ./filename.js
		let category
		for (const [key, value] of client.categories) { if (value.includes(args[1])) category = key }
		if (!category) throw "That command doesn't exist."
		delete require.cache[require.resolve(`./../${category}/${args[1]}.js`)]
		client.commands.set(args[1], require(`./../${category}/${args[1]}.js`))
		message.zreply(`${client.util.emoji("ok", message.guild)} \`${args[1]}\` was reloaded.`)
	}
}

let command = "reload"
	, description = "Reloads a module."
	, usage = "reload (module)"
	, throttle = {usages: 3, duration: 10}
	, permission = "dev"
	, category = "DEV"
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission, category: category}
