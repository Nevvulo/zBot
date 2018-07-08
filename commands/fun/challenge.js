const challengePending = {}
exports.settings = {command: "challenge", description: "Challenge somebody to a duel.", usage: "challenge [accept (name)]", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Settings = require("./../../structures/general/Settings.js")
	const Weapon = require("./../../structures/games/Weapon.js")
	const UserInfo = require("./../../models/user/User.js")
	const UserFinder = require("./../../structures/internal/Find.js")

	const prefix = await Settings.getValue(message.guild, "prefix")
	if (!challengePending.hasOwnProperty(message.guild.id)) challengePending[message.guild.id] = []
	const acceptuser = UserFinder.member(args.slice(1).join(" "), message.guild)[0]
	const user = UserFinder.member(args.slice(0).join(" "), message.guild)[0]
	function checkChallengeValidity(author, enemy) {
		for (const i in challengePending[message.guild.id]) {
			if (challengePending[message.guild.id][i].author == author && challengePending[message.guild.id][i].enemy == enemy) return i
		}
		return false
	}

	if (args[0] == "accept") {
		if (acceptuser == undefined) {
			return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid user. Try again and tweak your query.`)
		}

		// author
		// accept - enemy
		client.users.fetch(acceptuser.id).then(async function(authorAccept) { // ACCEPTUSER IS THE AUTHOR
			if (!checkChallengeValidity(authorAccept.id, message.author.id)) return message.zreply(`${client.util.emoji("nope", message.guild)} You don't have a pending challenge request from \`${authorAccept.username}\`.`)// message.author.id == enemy
			message.channel.zend(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: **${message.author.username}** has accepted **${authorAccept.username}**'s challenge! The fight will now begin, best of luck to both players.`)

			const userProfile = (await message.member.profile)
			if (userProfile == null) throw "An unknown error has occured. Try again in a few minutes."
			const userWeapon = Weapon.grabWeapon(userProfile.get("weapon"))
			const ChallengeStructure = require("./../../structures/games/Challenge.js")
			const challengeCreate = new ChallengeStructure(client)
			const id = challengeCreate.init(authorAccept, message.author, message.guild)
			message.author.send(`─────────────────────────────\n**CHALLENGE** ─ __${authorAccept.username} vs. ${message.author.username}__\n*Game #${id} is now starting.*\n─────────────────────────────`).catch(function() {
				return message.channel.zend(`${client.util.emoji("nope", message.guild)} I couldn't start the challenge as ${message.author} isn't able to receive DM's from me.`)
			})
			authorAccept.send(`─────────────────────────────\n**CHALLENGE** ─ __${message.author.username} vs. ${authorAccept.username}__\n*Game #${id} is now starting.*\n─────────────────────────────`).catch(function() {
				return message.channel.zend(`${client.util.emoji("nope", message.guild)} I couldn't start the challenge as ${authorAccept} isn't able to receive DM's from me.`)
			})

			if (Weapon.canSpecial(userWeapon)) {
				const words = ["It's now", "It is now", "It is", "It's"]
				const sentence = words[Math.floor(Math.random() * words.length)]
				authorAccept.send(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: ${sentence} **${message.author.username}**'s turn.`)
				message.author.send(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: ${sentence} your turn!\nWhat do you want to do? \`attack\` \`defend\` \`heal\` \`special\` \`stats\` \`end\``)
			} else {
				const words = ["It's now", "It is now", "It is", "It's"]
				const sentence = words[Math.floor(Math.random() * words.length)]
				authorAccept.send(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: ${sentence} **${message.author.username}**'s turn.`)
				message.author.send(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: ${sentence} your turn!\nWhat do you want to do? \`attack\` \`defend\` \`heal\` \`stats\` \`end\``)
			}

			const index = challengePending[message.guild.id].indexOf(checkChallengeValidity(authorAccept.id, message.author.id))
			challengePending[message.guild.id].splice(index, 1)
			return
		}).catch (function (e) {
			console.log(e)
			message.zreply(`${client.util.emoji("nope", message.guild)} You need to specify which user's challenge you are accepting by providing their name. (ie. \`${prefix}challenge accept ${message.author.username}\`)`)
			return
		})
		return
	}

	const enemy = user.user

	if (enemy == message.author) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't challenge yourself!`)
	if (!user) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid user. Try again and tweak your query.`)
	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to specify who you want to challenge by providing their name.`)

	if (checkChallengeValidity(message.author, enemy.id) !== false) {
		return message.zreply(`${client.util.emoji("nope", message.guild)} You've already initiated a challenge request to this user, please wait until your current request expires before trying again.`)
	} else {
		message.channel.zend(`${client.util.emoji("challenge", message.guild)} **CHALLENGE**: **${message.author.username}** has challenged **${enemy.username}** to battle!\n**${enemy.username}** has 60 seconds to accept this challenge by using \`${prefix}challenge accept ${message.author.username}\`, or ignore it.`)
		// Adds the user to the array so that they can't challenge someone for 60 seconds
		challengePending[message.guild.id].push({"author": message.author.id, "enemy": enemy.id})
		client.setTimeout(() => {
			if (checkChallengeValidity(message.author.id, enemy.id) == false) return
			const index = challengePending[message.guild.id].indexOf(checkChallengeValidity(message.author.id, enemy.id))
			challengePending[message.guild.id].splice(index, 1)
		}, 60000)
	}
}
