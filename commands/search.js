const google = require('google')
const Discord = require("discord.js");
const Settings = require('./../structures/general/Settings.js');

exports.run = (client, message, args) => {
	message.delete();

google.resultsPerPage = 25
var nextCounter = 0
const searchString = args.slice(0).join(' ');
if (searchString == "") {
	return message.reply(':no_entry_sign: **ERROR:** You need to enter something to search for. See `' + Settings.getValue(message.guild, "prefix") +'help search` for more information.');
}
google(searchString, function (err, res){

let randomPhrase = ["Right, here's what I've found under", "No problem! Here's what I've got for", "Searched the web for", "Alright, searching the web for", "Got that. Here's what I've got for", "Copy that, here's what I've found under", "Okay, I've found this for", "Here's what I've found under", "No problem boss. Found results for"]

  if (err) console.error(err)
	    var link = res.links[0];
			var description = link.description.slice(0, 1020)
			var title = link.title.slice(0, 254)
		const embed = new Discord.MessageEmbed()
			embed.setAuthor('Search » ' + message.author.tag, message.author.avatarURL( {format: 'png'} ))
			let phrase = randomPhrase[Math.floor(Math.random() * randomPhrase.length)];
			embed.setDescription(":white_check_mark: **OK:** " + phrase + " \"**" + searchString + "**\".")
			embed.setURL(link.href)
			if (description.length > 1) {
			embed.addField(title, description)
		} else {
			embed.addField(title, "*There doesn't seem to be a description for this result.*")
		}
			embed.setColor("#b3cc39")
		message.channel.send({ embed })
})
};

let command = 'search'
, description = 'Searches a given query on Google.'
, usage = 'search [query]'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
