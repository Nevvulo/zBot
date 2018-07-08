exports.settings = {command: "flip", description: "Flips a coin.", usage: "flip", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	let coin = ""
	switch (Math.floor(Math.random() * 1000) % 2) {
	case 0:
		coin = "heads"
		break
	case 1:
		coin = "tails"
		break
	}
	const randomPhrase = [`Looks like it's **${coin}** this time.`, `It's **${coin}**.`, `Alright, it's landed on **${coin}**.`, `Oh! Would you look at that? The coin's landed on **${coin}**!`]
	message.zreply(`:white_circle: **COIN FLIP**: ${randomPhrase[Math.floor(Math.random() * randomPhrase.length)]}`)
}
