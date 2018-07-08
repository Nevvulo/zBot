exports.settings = {command: "choose", description: "Chooses from options that you provide.", usage: "choose (option 1| [...])", info: "Options are delimited by `|`.",
	throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	args = args.slice(0).join(" ")
	const options = args.split("|")
	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide an option (or options) for me to choose from!`)
	if (options > 32) return message.zreply(`${client.util.emoji("nope", message.guild)} The amount of options you've provided is too high.`)
	if (options < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} The amount of options you've provided is too low.`)
	const nochoice = ["Thanks for giving me a choice...",
		"Not really much to pick from...",
		"I don't really get many options there, do I?",
		"Come on, you've got to give me more to pick from than that.",
		"Only one option? Are you just trying to get me to say one specific thing?",
		"Haven't you got anything better to do?",
		"Look at the vast amount of options I get to pick from...",
		"Wow, so much variety.",
		"If you're only going to give me one option to pick from why don't you just say it yourself?",
		"One option isn't really ideal in a command intended for multiple choice."]
	if (options.every((val, i, arr) => val === arr[0])) return message.zreply(`${client.util.emoji("nope", message.guild)} ${nochoice[Math.floor(Math.random() *
        nochoice.length)]}`)

	const sentences = ["Hmm... I think I'm going to have to go with $1!",
		"I'll pick $1 this time.",
		"Too easy! I just have to go with $1!",
		"It was a tough decision, but $1 is my final answer.",
		"It's a no-brainer, $1!",
		":thinking:\nI'm going to go with $1 today.",
		"I know this probably isn't the answer you're going to like, but I pick $1.",
		"You won't like this, but I'll go with $1",
		"Hmm... I think... Yeah, I'll pick $2- No! $1. Final answer is $1.",
		"I'm going to go with $1, $user",
		"I'm probably not the right guy to ask, but I'll go with $1.",
		"I've picked $1 in the past, so I'm going to stick with that.",
		"$1.",
		"I'll go with a nice $1.",
		"I'll go with $1.",
		"Okay, $1.",
		"I was going to pick $3, but I'll go with $1."]

	const firstoption = options[Math.floor(Math.random() * options.length)]
	const secondoption = options[Math.floor(Math.random() * options.length)]
	let phrase = sentences[Math.floor(Math.random() * sentences.length)].toString()
	if (firstoption.length > 1024 || secondoption.length > 1024) return message.zreply(
		`${client.util.emoji("nope", message.guild)} One or more of the options you have provided is too long to display.`)
	const translate = {
		"$1": `**${firstoption}**`,
		"$3": `**${secondoption}**`,
		"$2": `**${secondoption.slice(0, secondoption.length / 2)}**`,
		"$user": `**${message.member.displayName}**`
	}
	for (const key in translate) { phrase = phrase.replace(new RegExp(`\\${key}`, "ig"), translate[key]) }
	message.zreply(`${client.util.emoji("ok", message.guild)} ${phrase.toString()}`)
}
