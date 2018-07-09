exports.settings = { command: "exec", description: "Developer execution command.", usage: "exec **[code]**", permission: "dev" }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")

	let silent = false
	let code = args.join(" ")
	if (!message.author.developer) return message.reply(`${client.util.emoji("nope", message.guild)} You don't have permission to use this command.`)
	require('child_process').exec(code, (err, out) => {
		if (!err) {
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Execution » ${message.author.tag}`, client.user.displayAvatarURL())
			embed.setDescription(`${client.util.emoji("ok", message.guild)} Here is the return value of your execution;`)
			embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${code.length > 1010 ? `${code.substr(0, 1010)}...` : code}\`\`\``)
			embed.addField(`${client.util.emoji("info", message.guild)} Evaluation`, `\`\`\`js\n${out.length > 1010 ? `${out.substr(0, 1010)}...` : out}\`\`\``)
			embed.setColor("#7e57c2")
			message.channel.send({embed}).then(m => {
				m.react(client.util.emoji("ok", message.guild).replace("<:", "").replace(">", ""))
			})
		} else {
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Execution » ${message.author.tag}`, client.user.displayAvatarURL())
			embed.setDescription(`${client.util.emoji("nope", message.guild)} An error occured whilst executing your code;`)
			embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${code.length > 1010 ? `${code.substr(0, 1010)}...` : code}\`\`\``)
			embed.addField(`${client.util.emoji("nope", message.guild)} Error`, `\`\`\`js\n${err.length > 1010 ? `${err.substr(0, 1010)}...` : err}\`\`\``)
			embed.setColor("#ad1457")
			message.channel.send({embed}).then(m => {
				m.react(client.util.emoji("nope", message.guild).replace("<:", "").replace(">", ""))
			})
		}
	})
}