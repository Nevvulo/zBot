exports.settings = {command: "xkcd", description: "Select an xkcd comic to view, or see the latest one.", usage: "xkcd [number]", throttle: {usages: 3, duration: 10} }
exports.run = (client, message, args) => {
	const snekfetch = require("snekfetch")
	const Discord = require("discord.js")
	const moment = require("moment")
	args = args.slice(0).join(" ")

	snekfetch.get(args ? `http://xkcd.com/${args}/info.0.json` : "http://xkcd.com/info.0.json")
		.set("Accept", "application/json")
		.then(res => {
			res = JSON.parse(res.text)
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`xkcd » ${res.title}`, "https://pbs.twimg.com/profile_images/602808103281692673/8lIim6cB_400x400.png")
			embed.setColor("#64b5f6")
			embed.setDescription(`${client.util.emoji("ok", message.guild)} Here is xkcd comic \`#${res.num}\`.\n\n${res.alt}`)
			embed.setImage(res.img)
			embed.setFooter(`Comic created on the ${moment(`${res.day}-${res.month}-${res.year}`, "DD-MM-YYYY").format("Do [of] MMMM, YYYY")}`)
			message.channel.zend({ embed })
		})
}
