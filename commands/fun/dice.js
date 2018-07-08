exports.settings = {command: "dice", description: "Rolls a dice.", usage: "dice [number [...]]",
	info: "Multiple die can be rolled by separating each die you want to roll with a space. You can roll any number from 1 - 2147483647.", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	let dice = args.slice(0).join(" ") || 6

	if (args.length > 1) { dice = args }
	else {
		if (Number(args[0]) > 2147483647) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too high.`)
		dice = parseInt(args[0], 10)
	}

	if (dice.constructor === Array) {
		if (dice.length > 25) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't roll more than 25 die at a time.`)
		const diceArr = []
		for (let i = 0; i < dice.length; i++) {
			if (Number(dice[i]) > 2147483647) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too high.`)
			const roll = Number(Math.floor(Math.random() * dice[i]) + 1)
			if (isNaN(roll)) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided an invalid number in one of your rolls.`)
			diceArr.push(roll)
		}
		dice = diceArr.join(", ")
	} else {
		if (isNaN(dice)) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid number.`)
		dice = Math.floor(Math.random() * dice) + 1
	}

	const randomPhrase = [`Looks like you've rolled a **${dice}** this time.`, `You've landed on **${dice}**.`, `Alright, it's landed on **${ 
		dice}**.`, `Oh! Would you look at that? The dice landed on **${dice}**!`]
	message.zreply(`:game_die: **DICE**: ${randomPhrase[Math.floor(Math.random() * randomPhrase.length)]}`)
}
