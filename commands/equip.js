const fs = require('fs');
//Database require
const Slots = require('./../models/Slots.js');
const User = require('./../models/User.js');
const Badges = require('./../models/Badges.js');
const Settings = require('./../structures/general/Settings.js');

exports.run = async (client, message, args) => {
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));
const userBadges = await Badges.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
const userSlots = await Slots.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
const userProfile = await User.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
const prefix = await Settings.getValue(message.guild, "prefix")

var backgrounds = [];
	var testFolder = './assets/profile/backgrounds';
fs.readdir(testFolder, (err, files) => {
	files.forEach(file => {
		file = file.replace(".png", "")
		backgrounds.push(" " + file);
	});

message.delete();

if (args[0] == "list") {
if (args[1] == "badges" || args[1] == "badge") {
let tosend = []

	let tempRows = JSON.stringify(userBadges, null, 2)
	let jRows = JSON.parse(tempRows)
	for (var key in jRows) {
	     var value = jRows[key];
			 if (value > 0 && key !== "userId" && key !== "guild") {
			tosend.push(" " + key)
			}
	  }
		message.reply(":white_check_mark: **OK**: These are the badges that you currently own:**" + tosend + "**.");
return;
} else if (args[1] == "backgrounds" || args[1] == "background") {
	return message.reply(":white_check_mark: **OK**: Here are all of the backgrounds that you can equip:**" + backgrounds + "**.");
} else {
	return message.reply(":no_entry_sign: **NOPE**: That's not a valid category. Try `" + prefix + "equip list backgrounds` or `" + prefix + "equip list badges`");
}
return;
}

var num = args[0];
var badge = args[1]
if (num == 1 || num == 2 || num == 3 || num == 4 || num == 5 || num == 6) {
		if (eval(`userBadges.${badge}`) == 1 || badge == "empty") {
		eval(`Slots.update({ slot${num}: "${badge}" }, { where: { userID: message.author.id, guildID: message.guild.id } })`);
		message.reply(":white_check_mark: **OK:** You've successfully equipped the badge **" + badge + "** into slot **" + num + "**.");
		} else {
		message.reply(":no_entry_sign: **NOPE:** You can't equip this badge because you don't own it or it doesn't exist.");
		return;
		}
} else if (num == "background") {
			if (backgrounds.toString().includes(`${badge}`)) {
			eval(`User.update({ background: "${badge}" }, { where: { userID: message.author.id, guildID: message.guild.id } })`);
			message.reply(":white_check_mark: **OK:** You've successfully equipped the background **" + badge + "**.");
		return;
	} else {
		message.reply(":no_entry_sign: **NOPE:** You can't equip this background because you don't own it or it doesn't exist.");
		return;
		}
	} else if (num == "weapon") {
		// all possible weapons:
		// wooden, stone, iron, diamond, master
		if (badge == "wooden" || badge == "stone" || badge == "iron" || badge == "diamond" || badge == "master") {
		eval(`User.update({ wooden: "${badge}" }, { where: { userID: message.author.id, guildID: message.guild.id } })`);
		message.reply(":white_check_mark: **OK:** You've successfully equipped a **" + badge + "** sword! This can be used in challenges.");
	return;
} else {
	message.reply(":no_entry_sign: **NOPE:** You can't equip this background because you don't own it or it doesn't exist.");
	return;
	}
	} else if (num == "clear") {
		for (let i=1; i < 7; i++) {
		eval(`Slots.update({ slot${num}: "empty" }, { where: { userID: message.author.id, guildID: message.guild.id } })`);
		}
	message.reply(":white_check_mark: **OK:** You've successfully unequipped **all** of your items.");
	} else if (num == "all") {
				for (let i=1; i < 7; i++) {
				eval(`Slots.update({ slot${num}: "${badge}" }, { where: { userID: message.author.id, guildID: message.guild.id } })`);
				}
			message.reply(`:white_check_mark: **OK:** You've successfully equipped the badge **${badge}** in to *all* of your slots.`);
		} else if (args.toString() == "") {
			message.reply(":no_entry_sign: **NOPE:** You need to specify what item you want to equip in to which slot. (ex. `equip [slot] [item name]`).\nTo view what items you own, try `equip list [badges / backgrounds]`.");
		} else {
		 	message.reply(":no_entry_sign: **ERROR**: The syntax of the command is incorrect. Try `" + prefix + "help " + this.settings.command + "` to get more information on this command.")
		}
		});
}

let command = 'equip'
, description = 'Allows you to equip specific items to your profile.'
, usage = 'equip **[slot]** **[item name]**\nequip **list** **badges**/**backgrounds**'
, example = 'equip **background** **polymountains**\nParameter **slot** can be "background", "1-6" or "weapon".'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, example: example}
