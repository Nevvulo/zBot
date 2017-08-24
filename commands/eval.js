const Discord = require('discord.js');
const Settings = require('./../structures/general/Settings.js');
exports.run = (client, message, args) => {

	function clean(text) {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	}


const argseval = message.content.split(" ").slice(1);
	if (message.content.startsWith("+eval") && message.author.id == "246574843460321291") {
		try {
			var code = argseval.join(" ");
			var evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			message.delete();
			const embed = new Discord.MessageEmbed()
			message.channel.send({
				embed: {
					color: 3191350,
					author: {
						name: "ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ »  ",
						icon_url: message.author.displayAvatarURL
					},
					fields: [{
							name: '**:inbox_tray: Input**',
							value: `\`\`\`js\n${code}\n\`\`\``
						},
						{
							name: '**:outbox_tray: Output**',
							value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
						}
					],
					timestamp: new Date()
				}
			}).then(m => {
				m.react("✅");
			})
		} catch (err) {
			message.delete();
			const embed = new Discord.MessageEmbed()
			message.channel.send({
				embed: {
					color: 3191350,
					author: {
						name: "ᴇᴠᴀʟ ᴇʀʀᴏʀ »  ",
						icon_url: message.author.displayAvatarURL
					},
					fields: [{
							name: '**:no_entry_sign: Error**',
							value: `\`\`\`xl\n${clean(err)}\n\`\`\``
						},
						{
							name: '**Output**',
							value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
						}
					],
					timestamp: new Date()
				}
			}).then(m => {
				m.react("❌");
			})
		}
} else {
	message.channel.send(":no_entry_sign: **NOPE**: You don't have permission to use this command.")
}
}

let command = 'eval'
, description = 'Developer evaluation command.'
, usage = '+eval **[code]**'
, permission = 'dev'
exports.settings = {command: command, description: description, usage: usage, permission: permission}
