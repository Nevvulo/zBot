exports.settings = {command: "tag", description: "Allows you to create a tag with a message.", usage: ["tag create (name) (content)", "tag list [user | all]", "tag remove (name)", "tag edit (name) (content)", "tag info (name)"],
	throttle: {usages: 1, duration: 7} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const moment = require("moment")
	const Tags = require("./../../models/general/Tags.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Badges = new(require("./../../structures/user/Badges.js"))(message.member)
	const Experience = require("./../../structures/user/Experience.js")
	const userid = message.author.id
	const guildid = message.guild.id
	const subcommand = args[0] || ""
	const name = args[1] || ""
	const page = args[2] || ""
	const userArgs = args.slice(1).join(" ")
	const text = args.slice(2).join(" ")
	const isMod = await message.member.permission("MANAGE_MESSAGES")

	async function grabTagAttributes() {
		const finderInvalid = (Find.member(name, message.guild)[0] == undefined || name == "")
		const obj = {
			"%{user}": message.author,
			"%{username}": message.author.username,
			"%{tag}": message.author.tag,
			"%{displayname}": message.member.displayName,
			"%{discriminator}": message.author.discriminator,
			"%{userid}": message.author.id,
			"%{avatar}": message.author.displayAvatarURL(),
			"%{bot}": message.author.bot,
			"%{totalexp}": await Experience.getTotalExperience(message.member),
			"%{currentexp}": await Experience.getCurrentExperience(message.member),
			"%{level}": await Experience.getLevel(message.author.id, message.guild.id),
			"%{remainingexp}": Experience.getLevelBounds(await Experience.getLevel(message.author.id, message.guild.id)).upperBound - Experience.getLevelBounds(await Experience.getLevel(message.author.id, message.guild.id)).lowerBound,
			// MENTIONED USER
			"%{finder-username}": (!finderInvalid ? Find.member(name, message.guild)[0].user.username : message.author.username),
			"%{finder-tag}": (!finderInvalid ? Find.member(name, message.guild)[0].user.tag : message.author.tag),
			"%{finder-displayname}": (!finderInvalid ? Find.member(name, message.guild)[0].displayName : Find.member(message.author.id, message.guild)[0].displayName),
			"%{finder-discriminator}": (!finderInvalid ? Find.member(name, message.guild)[0].user.discriminator : message.author.discriminator),
			"%{finder-userid}": (!finderInvalid ? Find.member(name, message.guild)[0].id : message.author.id),
			"%{finder-avatar}": (!finderInvalid ? Find.member(name, message.guild)[0].user.displayAvatarURL() : message.author.displayAvatarURL()),
			"%{finder-bot}": (!finderInvalid ? Find.member(name, message.guild)[0].user.bot : message.author.bot),
			"%{finder-totalexp}": (!finderInvalid ? await Experience.getTotalExperience(Find.member(name, message.guild)[0]) : await Experience.getTotalExperience(message.member)),
			"%{finder-currentexp}": (!finderInvalid ? await Experience.getCurrentExperience(Find.member(name, message.guild)[0]) : await Experience.getCurrentExperience(message.member)),
			"%{finder-level}": (!finderInvalid ? await Experience.getLevel(Find.member(name, message.guild)[0].id, message.guild.id) : await Experience.getLevel(message.author.id, message.guild.id)),
			"%{finder-remainingexp}": (!finderInvalid ? Experience.getLevelBounds(await Experience.getLevel(Find.member(name, message.guild)[0].id, message.guild.id)).upperBound - Experience.getLevelBounds(await Experience.getLevel(Find.member(name, message.guild)[0].id, message.guild.id)).lowerBound :
				Experience.getLevelBounds(await Experience.getLevel(message.author.id, message.guild.id)).upperBound - Experience.getLevelBounds(await Experience.getLevel(message.author.id, message.guild.id)).lowerBound),
			// TEXT
			"%{text}": userArgs,
			"%{tagname}": subcommand
		}

		return obj
	}

	async function translate(txt) {
		const translate = await grabTagAttributes()
		for (const key in translate) {
			txt = txt.replace(new RegExp(key, "ig"), translate[key])
		}
		return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))
	}

	async function cleanString(string) {
		if (await Settings.getValue(message.guild, "allowMentionsInTags")) return string
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

	async function deleteTag(tag) {
		const rowCount = await Tags.destroy({ where: { name: tag, guildID: message.guild.id } })
		if (!rowCount) return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: There was an error whilst deleting tag **${tag}**.`)
		// Tagger - badge progress
		await Badges.editProgress("tagger", await Tags.count({ where: { guildID: message.guild.id, userID: message.author.id }} ))
		return message.reply(`${client.util.emoji("ok", message.guild)} **OK**: Tag **${tag}** was deleted.`)
	}

	if (subcommand == "create") {
		const tagexists = await Tags.findOne({ where: { name: name, guildID: guildid } })
		if (name == "") return message.reply(`${client.util.emoji("nope", message.guild)} **NOPE**: You need to give this tag a name.`)
		if ((name.includes("<@") || name.includes("<!@")) && name.includes(">")) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Tag names cannot contain mentions.`)
		if (name.includes("\n")) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Tag names cannot contain newlines.`)
		if (name.includes("`")) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Your tag name contains invalid characters.`)
		if (name.length > 48) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Tag names cannot be longer than 48 characters.`)
		if (name.length < 2) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Tag names must be longer than 2 characters.`)
		if (text.length < 1) return message.channel.send(`${client.util.emoji("nope", message.guild)} **NOPE**: Tags must contain at least 1 character.`)
		if (tagexists) return message.reply(`${client.util.emoji("nope", message.guild)} **NOPE**: That tag already exists.`)

		// TAG MANAGER
		try {
			await Tags.create({ name: name,
				description: text,
				userID: userid,
				guildID: guildid,
				usage_count: 0 })

			// Tagger - badge progress
			await Badges.editProgress("tagger", await Tags.count({ where: { guildID: message.guild.id, userID: message.author.id }} ))
			return message.reply(`${client.util.emoji("ok", message.guild)} **OK**: You've successfully created the tag **${name}**.`)
		} catch (e) {
			throw e
		}
	} else if (subcommand == "list") {
		if (name == "all") {
			const tagList = await Tags.findAll({ where: { guildID: message.guild.id } })
			const tagString = tagList.map(t => t.name) || "There are no tags on this guild."
			if (tagString.length < 1) return message.channel.send(`${client.util.emoji("incomplete", message.guild)} **OK**: There are no tags on this server. You can use \`${await Settings.getValue(message.guild, "prefix")}tag create (name) (message)\` to create one.`)
			new Interface().PaginationMenu(tagString, {title: `Tags » ${message.guild.name}`, author: message.guild.iconURL(), type: `Tags in ${message.guild.name}`, color: "34495e", description: `${client.util.emoji("ok", message.guild)} **OK**: Here is a list of all of the tags **on this guild**.\nTo see the next page` +
    ` of tags on this guild, type \`${await message.guild.prefix}tag list all [page number]\``, pageLength: 30, delimiter: "`, `"}, message, text)
		} else {
			const memberFetch = Find.member(name, message.guild)[0]
			if (!memberFetch && name !== "") return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: I couldn't find a user under that search.`)
			message.guild.members.fetch((name == "" ? message.author : memberFetch.id)).then(async function (member) {
				const tagList = await Tags.findAll({ where: { guildID: message.guild.id, userID: member.id } })
				const tagString = tagList.map(t => t.name)
				if (!tagString || tagString.length < 1) return message.reply(`${client.util.emoji("empty", message.guild)} **OK**: ${message.author.id == member.id ? "You have no tags." : "This user has no tags."}`)
				const displayUsersName = (message.author.id == member.id ? "you" : member.displayName)
				new Interface().PaginationMenu(tagString, {title: `Tags » ${member.user.tag}`, author: member.user.displayAvatarURL(), type: `Tags by ${displayUsersName}`, color: "34495e", description: `${client.util.emoji("ok", message.guild)} **OK**: Here is a list of all of the tags created **by ${displayUsersName}, on this guild**.\nTo see the next page` +
  ` of tags on this guild, type \`${await message.guild.prefix}tag list [user] [page number]\``, pageLength: 30, delimiter: "`, `"}, message, page)
			})
		}
	} else if (subcommand == "remove") {
		// DELETE FROM tags WHERE name = ?
		const findTag = await Tags.findOne({ where: { name: name, userID: message.author.id, guildID: message.guild.id } })
		if (!findTag && isMod) {
			const tagToDelete = await Tags.findOne({ where: { name: name, guildID: message.guild.id } })
			if (tagToDelete == undefined) return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: There's no tag that exists on this guild with the name **${name}**.`)
			const filter = m => m.author == message.author
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
				.then(collected => {
					if (collected.first().content.startsWith("y")) {
						deleteTag(name)
					}
					if (collected.first().content.startsWith("n")) {
						return message.channel.send(`${client.util.emoji("ok", message.guild)} **OK**: I won't delete tag **${tagToDelete.name}**.`)
					}
				})
				.catch(collected => {
					if (!collected.size) return message.channel.send(`${client.util.emoji("incomplete", message.guild)} **OK**: **${tagToDelete.name}** won't be deleted because you didn't reply with an answer in time.`)
				})

			client.users.fetch(tagToDelete.userID).then(async function(user) {
				message.channel.send(`:gear: **REMOVE TAG**: You don't own this tag, but since you are a moderator, you can remove it. Are you sure you want to remove tag **${tagToDelete.name}**? *(__y__es | __n__o)*`)
				const embed = new Discord.MessageEmbed()
				embed.setAuthor(`Remove Tag » ${tagToDelete.name.length > 1024 ? `${tagToDelete.name.substr(0, 64)}...` : tagToDelete.name}`, user.displayAvatarURL())
				embed.addField("Content", (tagToDelete.description == "" ? "*No content.*" : (tagToDelete.description.length > 1024 ? `${tagToDelete.description.substr(0, 1019)}...` : tagToDelete.description)))
				embed.setColor("#ffd54f")
				embed.setFooter(`Tag created by ${user.tag}`, client.user.displayAvatarURL())
				message.channel.send({ embed })
			})
		} else {
			deleteTag(name)
		}
	} else if (subcommand == "edit") {
		// equivalent to: UPDATE tags (descrption) values (?) WHERE name="?"
		const affectedRows = await Tags.update({ description: text },
			{ where: { name: name, guildID: message.guild.id, userID: message.author.id} })
		if (affectedRows > 0) {
			return message.reply(`${client.util.emoji("ok", message.guild)} **OK**: Tag **${name}** was edited.`)
		}
		return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: You don't own a tag with the name **${name}**.`)
	} else if (subcommand == "info") {
		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: name, guildID: message.guild.id } })
		if (tag) {
			message.guild.members.fetch(tag.userID).then(function(member) {
				return message.channel.send(`${client.util.emoji("info", message.guild)} **INFO**: The tag \`${name}\` was created **${moment(new Date(tag.createdAt)).fromNow()}** by **${member.user.tag}**, and has been used **${Number(tag.usage_count)} times**.`)
			})
		} else {
			return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: There's no tag with the name **${name}**.`)
		}
	} else if (subcommand == "variables") {
		const variablesArr = []
		let i = 0
		for (const key of Object.entries(await grabTagAttributes())) {
			i++
			variablesArr.push(`\`${i}\`. ${key}`)
		}
		new Interface().PaginationMenu(variablesArr, {title: `Variables » ${message.author.tag}`, author: client.user.displayAvatarURL(), type: "Tag Variables", color: "000000", description: `${client.util.emoji("ok", message.guild)} **OK**: Here is a list of all of the variables that can be used within tags;`, pageLength: 10}, message, name)
	} else if (subcommand == "preview") {
		const preview = await Tags.findOne({ where: { name: name, guildID: message.guild.id } })
		client.users.fetch(preview.userID).then(async function(user) {
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Preview » ${preview.name.length > 1024 ? `${preview.name.substr(0, 64)}...` : preview.name}`, client.user.displayAvatarURL())
			embed.addField("Content", (preview.description == "" ? "*No content.*" : (preview.description.length > 1024 ? `${preview.description.substr(0, 1019)}...` : preview.description)))
			embed.setColor("#4caf50")
			embed.setFooter(`Tag created by ${user.tag}`, user.displayAvatarURL())
			message.channel.send({ embed })
		})
	} else {
		// READ TAG
		const tag = await Tags.findOne({ where: { name: subcommand, guildID: message.guild.id } })
		if (tag) {
			const content = await translate(await cleanString(tag.get("description")))
			message.channel.send(`​${content}`) /* eslint no-irregular-whitespace: ["error", { "skipTemplates": true }]*/
			await tag.increment("usage_count", { where: { guildID: message.guild.id, name: subcommand }})
			return
		} else {
			return message.reply(`${client.util.emoji("nope", message.guild)} **ERROR**: There isn't a tag that exists under that name.`)
		}
	}
}
