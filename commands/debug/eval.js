exports.run = (client, message, args) => {

	function clean(text) {
		if (typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
		else
			return text;
	}


const argseval = message.content.split(" ").slice(1);
	if (message.content.startsWith("%eval") && message.author.id == "246574843460321291") {
		try {
			var code = argseval.join(" ");
			var evaled = eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);
			message.delete();

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
				m.react(":xailFish:303393341704503297");
			})
		}
}
}
