const Discord = require('discord.js');

class Interface {
	constructor () {

  }

	unembedify(embed) {
		const em = embed
		let structure = "";
		if (em.author) structure += `**${em.author.name}**\n`;
		if (em.title) structure += `**${em.title}**\n`;
		if (em.description) structure += `${em.description}\n`;
		for (let i in em.fields) {
		structure += `\n**${em.fields[i].name}**\n${em.fields[i].value}\n`
		}
		if (em.footer) structure += `\n${em.footer.text}`
		console.log(embed)
		return this.clean(structure, em.message); //returns a string
	}

 	PaginationMenu(data, settings, message, page) {
		function missingRequired(required) {
			this.required = required;
			this.toString = function() {
				return "Interface: PaginationMenu ─ Required parameter " + this.required + " is missing or undefined";
			};
		}

		data = data || [];
		settings = settings || {};
		message = message || null;
		page = page || 1;

		if (!data || data.length < 1) throw new missingRequired("DATA");
		if (!settings) throw new missingRequired("SETTINGS");
		if (!message) throw new missingRequired("MESSAGE");

		const embed = new Discord.MessageEmbed();
		if (data.length > settings.pageLength) {
				if (isNaN(page) || page < 0) return (async () => {message.zreply(client.util.emoji("nope", message.guild) + " That's not a valid page number. Try `" + await message.guild.prefix + settings.command.name + settings.comamnd.subcommand + " 2` to see page 2 of this menu.")})();
				if (Math.ceil(data.length / settings.pageLength) < page) return message.zreply(client.util.emoji("nope", message.guild) + " Page `" + page + "` doesn't exist. There are only `" + Math.ceil(data.length / settings.pageLength) + "` pages.")
				embed.setFooter((!settings.footer ? settings.type : settings.footer.text) + " ─ Page " + page + " of " + Math.ceil(data.length / settings.pageLength), !settings.footer ? "" : settings.footer.avatar)
				data = data.splice(settings.pageLength + (page - 2) * settings.pageLength, settings.pageLength)
		}

		let prefix = "";
		let suffix = "";
		if (!settings.delimiter) settings.delimiter = "\n"
		if (settings.delimiter == "`, `" || settings.delimiter == "`\n`") { prefix = "`"; suffix = "`"; }
		embed.setAuthor(settings.title, settings.author)
		embed.setDescription(settings.description)
		embed.addField(settings.type, prefix + (data.constructor === Array && settings.delimiter ? data.join(settings.delimiter) : data) + suffix)
		embed.setColor(settings.color.startsWith("#") ? settings.color : "#" + settings.color)
		return message.channel.zend({ embed })
	}

	clean(string, message) {
		const client = require('./../../bot.js').eval(0, "client");
			if (typeof string == "object") string = string.content; message = string;
	    if (!string) return string;
	    return string
	    .replace(/@(everyone|here)/g, '@\u200b$1')
	    .replace(/<@!?[0-9]+>/g, input => {
	      const id = input.replace(/<|!|>|@/g, '');
	      if (message.channel.type === 'dm' || message.channel.type === 'group') {
	        return client.users.has(id) ? `@${client.users.get(id).username}` : input;
	      }

	      const member = message.channel.guild.members.get(id);
	      if (member) {
	        if (member.nickname) return `@${member.nickname}`;
	        return `@${member.user.username}`;
	      } else {
	        const user = client.users.get(id);
	        if (user) return `@${user.username}`;
	        return input;
	      }
	    })
	    .replace(/<#[0-9]+>/g, input => {
	      const channel = client.channels.get(input.replace(/<|#|>/g, ''));
	      if (channel) return `#${channel.name}`;
	      return input;
	    })
	    .replace(/<@&[0-9]+>/g, input => {
	      if (message.channel.type === 'dm' || message.channel.type === 'group') return input;
	      const role = message.guild.roles.get(input.replace(/<|@|>|&/g, ''));
	      if (role) return `@${role.name}`;
	      return input;
	    });
	}
}

class zBotError {
	constructor(client, error, message, command) {
		this.client = client;
		this.error = error;
		this.message = message;
		this.command = command || "a command";

		init();
	}

	async init() {
		await fs.readFile('./data/main/errorHandle/errorMessage.txt', function(err, data) {
			this.description = data.toString().split('\n');
		})
		await fs.readFile('./data/main/errorHandle/errorFooter.txt', async function(err, data) {
				this.footer = data.toString().split('\n');
		})
	}

	async Command(client = this.client, error = this.error, message = this.message, command = this.command) {
		client.util.log(`[COMMAND ERROR] ${error.stack || error}`, "critical")
		const embed = new Discord.MessageEmbed();
		embed.setAuthor("Error » " + message.author.tag + " running " + command);
		embed.setColor("#C62828");
		embed.setDescription(client.util.emoji("nope", message.guild) + " " + this.description[Math.floor(Math.random()*this.description.length)])
		embed.addField("`Error Content`", "```js\n" + error + "```");
		embed.addField(this.footer[Math.floor(Math.random()*this.footer.length)], "We've logged this error, and we'll have it fixed soon.\nIf the problem persists, consider reporting this bug on our support server. (`" + await message.guild.prefix + "invite`)")
		message.channel.zend({ embed });
	}

	async Internal(client = this.client, error = this.error, message = this.message) {
		client.util.log(`[INTERNAL ERROR] ${error.stack || error}`, "critical")
		const embed = new Discord.MessageEmbed();
		embed.setAuthor("Error » Serious Internal Error");
		embed.setColor("#e65100");
		embed.setDescription(client.util.emoji("nope", message.guild) + " " + this.description[Math.floor(Math.random()*this.description.length)])
		embed.addField("`Error Content`", "A serious internal error has occured within zBot and the current operation has been cancelled.\n```js\n" + error + "```");
		embed.addField(this.footer[Math.floor(Math.random()*this.footer.length)], "We've logged this error, and we'll have it fixed soon.\nIf the problem persists, consider reporting this bug on our support server. (`" + await message.guild.prefix + "invite`)")
		message.channel.zend({ embed });
	}

	async Unknown(client = this.client, error = this.error, message = this.message) {
		client.util.log(`[UNKNOWN ERROR] ${error.stack || error}`, "critical")
		const embed = new Discord.MessageEmbed();
		embed.setAuthor("Error » Unknown Error");
		embed.setColor("#424242");
		embed.setDescription(client.util.emoji("nope", message.guild) + " " + this.description[Math.floor(Math.random()*this.description.length)])
		embed.addField("`Error Content`", "An unknown error has occured and the current operation has been terminated.\n```js\n" + error + "```");
		embed.addField(this.footer[Math.floor(Math.random()*this.footer.length)], "We've logged this error, and we'll have it fixed soon.\nIf the problem persists, consider reporting this bug on our support server. (`" + await message.guild.prefix + "invite`)")
		message.channel.zend({ embed });
	}
}

module.exports = { Interface, zBotError };
