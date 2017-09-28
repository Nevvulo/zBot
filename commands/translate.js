const snekfetch = require("snekfetch");
const Discord = require('discord.js');
const api = require('./../data/main/keys/keys.js');

exports.run = (client, message, args) => {
	message.delete()
	const target = args[0];
	const translationmessage = args.slice(1).join(' ');
	const key = api.youtube();

	function translate(txt) {
		if (target == "Australian") {
    var translate = {
        "McDonalds": "maccas",
				"friend": "mate",
				"listen": "oi",
				"my god": "blimey",
				"holy shit": "shit my dick",
				"very": "bloody",
				"an idiot": "a dickhead",
				"good": "ace",
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
				"whoa": "crikey"
    };

		for (var key in translate) {
        txt = txt.replace(new RegExp(key, "ig"), translate[key]);
    }

    return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))  //Capitalize the first
	} else if (target == "HTTP") {
	var translate = {
			"200": "OK",
			"201": "Created",
			"202": "accepted",
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
	};

	for (var key in translate) {
			txt = txt.replace(new RegExp(key, "ig"), "**" + translate[key] + "**");
	}

	return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))  //Capitalize the first
}
}

if (target == "Australian" || target == "HTTP") {
	var translated = translate(translationmessage)
	var source = "English"

	if (message.content.length > 1023 || translated.length > 1023) return message.reply(":no_entry_sign: **NOPE**: Your translation message is too long to parse. Try translating something shorter.")

	const embed = new Discord.MessageEmbed();
	embed.setAuthor("Translation from English to " + target + " » ", client.user.avatarURL( {format: "png"} ));
	embed.addField(source, translationmessage)
	embed.addField(target, translated)
	message.channel.send({ embed })
	return;
}

snekfetch.get(`https://translation.googleapis.com/language/translate/v2?target=${target}&q=${encodeURIComponent(translationmessage)}&key=${key}`)
.set('Accept', "application/json")
.then(res => {
	var text = JSON.parse(res.text)
		var translated = text.data.translations[0].translatedText
		var source = text.data.translations[0].detectedSourceLanguage

		if (message.content.length > 1023 || translated.length > 1023) return message.reply(":no_entry_sign: **NOPE**: Your translation message is too long to parse. Try translating something shorter.")

		const embed = new Discord.MessageEmbed();
		embed.setAuthor("Translation from " + source + " to " + target + " » ", client.user.avatarURL( {format: "png"} ));
		embed.addField(source, translationmessage)
		embed.addField(target, translated)
		message.channel.send({ embed })
		});
}

let command = 'translate'
, description = 'Translates given text in to a chosen language.'
, usage = 'translate **(target language)** **(message to translate)**'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
