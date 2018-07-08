exports.settings = {command: "search", description: "Searches a given query on Google.", usage: "search (query)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Google = require("./../../structures/general/Google.js")
	const searchString = args.slice(0).join(" ")

	if (!searchString) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter something to search for. See \`${await message.guild.prefix} help search\` for more information.`)
	const randomPhrase = ["Right, here's what I've found under", "No problem! Here's what I've got for", "Searched the web for", "Alright, searching the web for", "Got that. Here's what I've got for", "Copy that, here's what I've found under", "Okay, I've found this for", "Here's what I've found under", "No problem boss. Found results for"]
	const phrase = randomPhrase[Math.floor(Math.random() * randomPhrase.length)]

	Google.search(searchString, message.channel && message.channel.nsfw)
		.then(({ card, results }) => {
			if (card) {
				message.zreply(`${client.util.emoji("ok", message.guild)} ${phrase} "**${searchString.length > 200 ? searchString.substr(0, 200) : searchString}**".\n${card}`)
			} else if (results.length) {
				const links = results.map((r) => r.link)
				message.zreply(`${client.util.emoji("ok", message.guild)} ${phrase} "**${searchString.length > 200 ? searchString.substr(0, 200) : searchString}**".\n\`1.\` ** ${links[0]} **`
+ `\n${links.slice(1, 3).map((l, t) => `\`${t+2}.\` <${l}>`).join("\n").trim()}`)
			} else {
				message.zreply(`${client.util.emoji("nope", message.guild)} I wasn't able to find any results under that search.`)
			}
		})
}
