exports.run = (client, message, args) => { if (args == "") return; throw args.slice(0).join(" ") }

let command = "throw"
	, description = "Throws an error."
	, usage = "throw"
	, throttle = {usages: 4, duration: 10}
	, permission = "dev"
	, category = "DEV"
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission, category: category}
