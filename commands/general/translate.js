exports.settings = {command: "translate", description: "Translates given text in to a chosen language. You provide the language you want to translate to as a country code, zBot will automatically detect what the source language is.",
	usage: "translate (target language as country code) (message to translate)", throttle: {usages: 4, duration: 10} }

const EN_AU_TRANSLATION = {
	"McDonald's": "maccas",
	"McDonalds": "maccas",
	"friend": "mate",
	"listen": "oi",
	"my god": "blimey",
	"holy shit": "shit my dick",
	"very": "bloody",
	"an idiot": "a dickhead",
	"good": "ace",
	"mate": "cunt",
	"australian": "aussie",
	"australia": "land down unda",
	"sausage": "banger",
	"sausages": "bangers",
	"new zealander": "kiwi",
	"hello": "g'day",
	"afternoon": "arvo",
	"barbeque": "barbie",
	"great": "ripper",
	"24-pack": "slab",
	"whining": "sooking",
	"whine": "sook",
	"awesome": "sweet as",
	"thanks": "ta",
	"thank you": "ta",
	"full": "chockers",
	"fuck": "root",
	"woah": "crikey",
	"jesus": "crikey",
	"whoa": "crikey",
	"ditch": "wag"
}

exports.run = async (client, message, args) => {
	message.content = message.cleanContent
	const snekfetch = require("snekfetch")
	const Discord = require("discord.js")
	const Badges = new (require('./../../structures/user/Badges.js'))(message.member);
	const target = args[0]
	let translationmessage = args.slice(1).join(" ")
	translationmessage = translationmessage.length > 1020 ? `${translationmessage.slice(0, 1020)}...` : translationmessage
	const api = new (require("./../../data/main/keys/keys.js"))()
	const key = api.lavalink

	function translate(txt) {
		if (target.includes("au")) {
			let fin = EN_AU_TRANSLATION
			if (target.startsWith("au>")) fin = Object.keys(EN_AU_TRANSLATION).reduce((obj, key) => (obj[EN_AU_TRANSLATION[key]] = key, obj), {});
			for (const key in fin) {
				txt = txt.replace(new RegExp(key, "ig"), fin[key])
			}
			return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))  // Capitalize the first
		} else if (target == "HTTP") {
			const translate = {
				"200": "OK",
				"201": "Created",
				"202": "Accepted",
				"203": "Non-Authoritative Information",
				"204": "No Content",
				"205": "Reset Content",
				"206": "Partial Content",
				"207": "Multi-Status",
				"208": "Already Reported",
				"300": "Multiple Choices",
				"301": "Moved Permanently",
				"302": "Found",
				"303": "See Other",
				"304": "Not Modified",
				"305": "Use Proxy",
				"306": "Switch Proxy",
				"307": "Temporary Redirect",
				"308": "Permanent Redirect",
				"400": "Bad Request",
				"401": "Unauthorized",
				"402": "Payment Required",
				"403": "Forbidden",
				"404": "Not Found",
				"405": "Method Not Allowed",
				"406": "Not Acceptable",
				"407": "Proxy Authentication Required",
				"408": "Request Timeout",
				"409": "Conflict",
				"410": "Gone",
				"411": "Length Required",
				"412": "Precondition Failed",
				"413": "Payload Too Large",
				"414": "URI Too Long",
				"415": "Unsupported Media Type",
				"416": "Range Not Satisfiable",
				"417": "Expectation Failed",
				"418": "I'm a teapot",
				"421": "Misdirected Request",
				"422": "Unprocessable Entity",
				"423": "Locked",
				"424": "Failed Dependency",
				"426": "Upgrade Required",
				"428": "Precondition Failed",
				"429": "Too Many Requests",
				"431": "Request Header Fields Too Large",
				"451": "Unavailable For Legal Reasons",
				"500": "Internal Server Error",
				"501": "Not Implemented",
				"502": "Bad Gateway",
				"503": "Service Unavailable",
				"504": "Gateway Timeout",
				"505": "HTTP Version Not Supported",
				"506": "Variant Also Negotiates",
				"507": "Insufficient Storage",
				"508": "Loop Detected",
				"510": "Not Extended",
				"511": "Network Authentication Required"
			}

			for (const key in translate) {
				txt = txt.replace(new RegExp(key, "ig"), `**${translate[key]}**`)
			}

			return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))  // Capitalize the first
		}
	}

	if (target.includes("au") || target == "HTTP") {
		const translated = translate(translationmessage)
		const source = "English"
		const embed = translationEmbed(source, target, translationmessage, translated)
		return message.channel.zend({ embed })
	}

	function translationEmbed(source, target, input, output) {
		const decode = function(str) {
			return str.replace(/&#(\d+);/g, function(match, dec) {
				return String.fromCharCode(dec)
			})
		}

		if (output.length > 1023 || input.length > 1023) return message.zreply(`${client.util.emoji("nope", message.guild)} Your translation message is too long to parse. Try translating something shorter.`)
		Badges.incrementProgress("multilingual")
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Translation from ${source} to ${target} » ${message.author.tag}`, client.user.avatarURL( {format: "png"} ))
		embed.addField(source, input)
		embed.addField(target, decode(output))
		embed.setColor("#ef5350")
		return embed
	}

	snekfetch.get(`https://translation.googleapis.com/language/translate/v2?target=${target}&q=${encodeURIComponent(translationmessage.replace(/\n/g, "<br>"))}&key=${key}`)
		.set("Accept", "application/json")
		.then(res => {
			const translated = JSON.parse(res.text).data.translations[0].translatedText
			const source = JSON.parse(res.text).data.translations[0].detectedSourceLanguage
			const embed = translationEmbed(source, target, translationmessage, translated.replace(/<br>/g, "\n"))
			return message.channel.zend({ embed })
		}).catch(async (e) => {
			console.log(e)
			return message.zreply(`${client.util.emoji("nope", message.guild)} There was an error processing the translation. Make sure that you have provided a *valid* country code to translate to. For more information, type \`${await message.guild.prefix}help ${this.settings.command}\`.`)
		})
}
