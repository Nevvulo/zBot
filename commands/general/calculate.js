exports.settings = {command: "calculate", description: "A math command to evaluate equations you give it! It can do basic mathematics, complex equations (if formatted correctly) and even conversions!",
	usage: "calculate (equation)", throttle: {usages: 3, duration: 10}, aliases: ["math", "calc"], example: "calculate 32 kilograms to grams\nThe above will return `32000 grams`." }
exports.run = (client, message, args) => {
	const math = require("mathjs")
	const Discord = require("discord.js")
	const fs = require("fs")
	const messagesay = args.slice(0).join(" ")
	const parser = math.parser()

	// CONVERSIONS
	parser.set("blake", math.unit("60.96cm")) // In reference to Fakin It, where the question was "Say how tall you are in feet", and I answered 2.
	parser.set("smol", math.eval("1.6 * 10^-35m")) // Planck length
	parser.set("tnt", math.eval("4.184 * 10^9 J")) // The energy 1 tnt produces
	parser.set("littleboy", math.eval("6 * 10^13 J")) // The energy a hiroshima bomb produces
	parser.set("sun", math.eval("2.0 * 10^30 kg")) // The mass of the sun
	parser.set("jiffy", math.eval("0.01 seconds")) // A tick in a computer
	parser.set("void", "69") // void
	parser.set("victor", math.eval("999")) // victor
	if (message.content.length > 1020) return message.zreply(`${client.util.emoji("nope", message.guild)
	} Your equation is too long to calculate. Try again, or simplify your equation.`)

	function throwError(err) { return message.zreply(`${client.util.emoji("nope", message.guild)
	} An error occured whilst running the command. ${err.toString()}`) }

	try {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Math Result » ${message.author.tag}`, message.author.displayAvatarURL())
		embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${messagesay}\n\`\`\``)
		embed.addField(`${client.util.emoji("info", message.guild)} Evaluation`, `\`\`\`js\n${parser.eval(messagesay)}\n\`\`\``)
		embed.setColor("#37474f")
		embed.setTimestamp()
		message.channel.zend({ embed })
	} catch (err) {
		const previousError = err
		const fx = require("money")
		const money = JSON.parse(fs.readFileSync("./data/math/Money.json", "utf8"))
		fx.rates = JSON.parse(money).rates
		fx.base = JSON.parse(money).base

		// Check money.js has finished loading:
		if (typeof fx !== "undefined" && fx.rates) {
			fx.rates = JSON.parse(money).rates
			fx.base = JSON.parse(money).base
		}

		if (args[0] == undefined || args[1] == undefined || args[3] == undefined) return throwError(err)

		try {
			// x usd to aud or something
			const demo = fx(args[0]).from(args[1]).to(args[3])
			if (demo !== undefined) {
				const embed = new Discord.MessageEmbed()
				embed.setAuthor(`Math Result » ${message.author.tag}`, message.author.displayAvatarURL())
				embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${messagesay}\n\`\`\``)
				embed.addField(`${client.util.emoji("info", message.guild)} Evaluation`, `\`\`\`js\n${demo} ${args[3]}\n\`\`\``)
				embed.setColor("#424242")
				embed.setTimestamp()
				message.channel.zend({ embed })
			}
		} catch (err) {
			return throwError(previousError)
		}

		return
	}
}
