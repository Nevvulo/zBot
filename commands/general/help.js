exports.settings = { command: "help", description: "Displays all available information about commands and help for zBot.", usage: "help [command]", throttle: { usages: 3, duration: 10 } }
exports.run = async (client, message, args) => {
	const { createCanvas, registerFont, Image } = require("canvas")
	const Discord = require("discord.js")
	const Permissions = require('./../../structures/internal/Permissions.js');
	const Settings = require('./../../structures/general/Settings.js');
	const fs = require("fs")

	async function getCommandHelp(command) {
		let help = {title: "", desc: "", usage: "*No usage*.", throttle: "0", example: "", permission: "", info: ""};
		const prefix = await Settings.getValue(message.guild, "prefix")

		try {
			let category;
	   		for (const [key, value] of client.categories) { if (value.indexOf(command) > -1) category = key }
			if (client.commands.has(command)) commandFile = client.commands.get(command);
			if (client.aliases.has(command)) commandFile = client.commands.get(client.aliases.get(command))
			var discordPermission = (commandFile.settings.permission == undefined || typeof(commandFile.settings.permission) !== "object" ? "VIEW_CHANNEL" : commandFile.settings.permission.user);
			var commandPermission = (commandFile.settings.permission == undefined || typeof(commandFile.settings.permission) !== "object" ? commandFile.settings.permission : commandFile.settings.permission.command);
			var permissionLevel = await message.member.permission(discordPermission)

			help = {title: "Information about `" + command + "`.", desc: commandFile.settings.description, usage: commandFile.settings.usage, throttle: commandFile.settings.throttle, example: commandFile.settings.example, permission: commandFile.settings.permission, info: commandFile.settings.info};

			const embed = new Discord.MessageEmbed();
			embed.setAuthor("Help » " + message.author.tag);
			embed.setColor("#f4d742");
			embed.setDescription(client.util.emoji("info", message.guild) + " " + help.title)
			var perms = [
				"user",
				"mod",
				"owner",
				"dev"
			]

			if (category === 'nsfw') {
				embed.setDescription(client.util.emoji("info", message.guild) + " " + help.title + "\n" + client.util.emoji("warning", message.guild) + " This command is NSFW, it can only be used in NSFW channels.")
				embed.setColor("#c62828");
			}

			var inheritPermission = (typeof(commandFile.settings.category) == "object" ? (commandFile.settings.category.inheritPermission == undefined ? true : false) : true)
			if (commandPermission !== undefined && inheritPermission) {
				if (typeof(permissionLevel) !== "boolean") {
				if (permissionLevel < perms.indexOf(commandPermission)) {
						embed.setDescription(client.util.emoji("info", message.guild) + " " + help.title + "\n" + client.util.emoji("nope", message.guild) + " You don't have permission to run this command.")
						embed.setColor("#f48841");
				}
			} else {
				if (!permissionLevel) {
				embed.setDescription(client.util.emoji("info", message.guild) + " " + help.title + "\n" + client.util.emoji("nope", message.guild) + " You need the `" + discordPermission + "` permission to run this command." )
				embed.setColor("#e25a28");
				}
			}
			}

			let displayHelpAs = prefix + help.usage;
			if (typeof(help.usage) === 'object') {
				displayHelpAs = [];
				for (let i in help.usage) {
					displayHelpAs.push(prefix + help.usage[i])
				}
				displayHelpAs = displayHelpAs.join("\n")
			}

			embed.addField("**Description**", help.desc);
			embed.addField("`Usage`", "```" + displayHelpAs + "```");
			if (help.example) embed.addField("**Example**", prefix + help.example);
			if (help.info) embed.addField("**More Information**", help.info);
			embed.setFooter("zBot • Help", client.user.avatarURL( {format: 'png' }));
			return { embed: embed };
		} catch(err) {
			return message.zreply(`${client.util.emoji("nope", message.guild)} \`${command.replace("`", "")}\` isn't a valid command.`)
		}
	}

	if (args[0] && args[0] != "--dm") {
		const commandHelp = await getCommandHelp(args[0])
		return message.channel.zend(commandHelp);
	}

	const embed = new Discord.MessageEmbed()
	embed.setAuthor("zBot • Help  »  ", client.user.avatarURL({ format: "png" }))
	embed.setColor("#26c6da")
	embed.setDescription(`${client.util.emoji("info", message.guild)} These are all of the commands available in zBot.\nTo view more information about \
a specific command, type \`${await message.guild.prefix}help [command]\`.\
\n\n${client.util.emoji("warning", message.guild)} **IMPORTANT** ${client.util.emoji("warning", message.guild)}\nThe zBot project will be discontinued on the **20th of July, 2018**.\nOn that date, zBot will remain offline forever.\
\nTo find out more about this, please [join our server](https://discord.gg/uQWCfXB).`)
	let commandCount = 0

	for (let [key, value] of client.categories) {
		if (key == "developer") continue
		if (key == "nsfw") key = key.toUpperCase()
		key = key.charAt(0).toUpperCase() + key.slice(1)
		let commandArr = []
		for (const i in value) { commandCount++
			commandArr.push(`\`${value[i]}\``) }
		embed.addField(key, commandArr.join(", ") || "*This category has no commands.*")
		commandArr = []
	}

	embed.setFooter(`zBot Help Menu ─ ${client.categories.size} categories with ${commandCount} commands total`)

	if (args[0] == "--dm") {
		message.author.send({ embed }).then(() => {
			message.zreply(`${client.util.emoji("ok", message.guild)} I've sent help information to your DMs!`)
		}).catch(async function() {
			registerFont("../../assets/profile/fonts/UniSansHeavy.ttf", { family: "Uni Sans CAPS" })
			const canvas = createCanvas(446, 208)
			const ctx = canvas.getContext("2d")
			const base = new Image()

			const generate = () => {
				// Environment Variables
				ctx.drawImage(base, 0, 0, 446, 208)
				ctx.scale(1, 1)
				ctx.font = "16px \"Uni Sans Heavy CAPS\""
				ctx.textAlign = "left"
				ctx.fillStyle = "#FFF"
				ctx.fillText(message.guild.name, 184, 38.5)
			}

			base.src = await fs.readFileAsync("./assets/help/helpguide.png")
			generate()
			message.zreply(`${client.util.emoji("error", message.guild)} I wasn't able to send you the help information. Make sure your privacy settings allow me to DM you, and that you aren't blocking me.\nYou can also find help information on the zBot website at \`https://zbot.me/documentation\`.`, {
				files: [{
					attachment: canvas.toBuffer(),
					name: "stats.png"
				}]
			})
		})
	} else {
		return message.channel.zend({ embed })
	}
}
