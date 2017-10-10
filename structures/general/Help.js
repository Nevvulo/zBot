const Discord = require('discord.js');
const Version = require('./Version.js');
const Settings = require('./Settings.js')
var help = {title: "Title not supplied.", desc: "No description found.", usage: "No usage found."};
var prefix = "+";

class Help {

	static async getCommandHelp(command, guild) {
			const commandFile = require(`./../../commands/${command}.js`);

			help.title = "Information about `" + command + "`.";
			help = {title: "", desc: commandFile.settings.description, usage: commandFile.settings.usage, throttle: commandFile.settings.throttle, example: commandFile.settings.example, permission: commandFile.settings.permission};
			const embed = new Discord.MessageEmbed();
			embed.setAuthor("ʜᴇʟᴘ »  ");
			embed.setColor("#f4d742");
			embed.setDescription(":information_source: Information about `" + command + "`.")

			if (help.permission == "mod") {
				embed.setDescription(":information_source: Information about `" + command + "`.\n:no_entry_sign: You don't have permission to run this command.")
				embed.setColor("#f48841");
			}

			if (help.permission == "owner") {
				embed.setDescription(":information_source: Information about `" + command + "`.\n:no_entry_sign: Only " + guild.owner.displayName + " can run this command.")
				embed.setColor("#e25a28");
			}

			embed.addField("**Description**", help.desc);
			embed.addField("**Usage**", await Settings.getValue(guild, "prefix") + help.usage);
			if (help.example !== undefined) {
				embed.addField("**Example**", await Settings.getValue(guild, "prefix") + help.example);
			}

			embed.setFooter("zBot • Help • version " + Version.getVersionNumber(), client.user.avatarURL( {format: 'png' }));
			return { embed };
	}

	static throttleInfo(command) {
		const commandFile = require(`./../../commands/${command}.js`);
		return commandFile.settings.throttle;
	}
}

module.exports = Help;
