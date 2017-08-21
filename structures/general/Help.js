const Discord = require('discord.js');
var help = {title: "", desc: "its a description but its empty..........", usage: "what"};
var prefix = "+";

class Help {

	static getCommandHelp(command) {
		console.log(help)
			const commandFile = require(`./../../commands/${command}.js`);
			console.log(commandFile)

			help.title = "Information about `" + command + "`.";
			help = {title: "", desc: commandFile.settings.description, usage: commandFile.settings.usage, throttle: commandFile.settings.throttle, example: commandFile.settings.example, permission: commandFile.settings.permission};
			console.log(help.desc)
			const embed = new Discord.MessageEmbed();
			embed.setAuthor("ʜᴇʟᴘ »  ");
			embed.setColor("#f4d742");
			embed.setDescription(":information_source: Information about `" + command + "`.")

			if (help.permission == "mod") {
				embed.setDescription(":information_source: Information about `" + command + "`.\n:no_entry_sign: You don't have permission to run this command.")
				embed.setColor("#f48841");
			}
			embed.addField("**Description**", help.desc);
			embed.addField("**Usage**", help.usage);
			if (help.example !== undefined) {
				embed.addField("**Example**", help.example);
			}

			embed.setFooter("yeah its help what the hell do you want bro")

			return { embed };
	}
}

module.exports = Help;
