const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const Settings = require('./../structures/general/Settings.js');
const Punish = require('./../structures/moderation/HandlePunish.js');
var colors = require('colors');

var answered = false;

exports.run = (client, message, args) => {
	message.delete();
		args = args.toString();
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

		//Grab command and remove user argument to get reason
		var unban = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				unban = (unban + argsArray[i] + " ");
			}
			unban = unban.replace(argsArray[0], "");
			unban = unban.trim();
		}


		if (args == "" || args == undefined) {
			message.reply(':no_entry_sign: **ERROR**: You need to enter the ID of a user to unban. See `' + Settings.getValue(message.guild, "prefix") +'help unban` for more information.');
			return;
		}

		client.users.fetch(args.split(" ").toString()).then(function (user) {
			if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply(":no_entry_sign: **NOPE**: I don't have permission to unban this person. Make sure I have the `BAN_MEMBERS` permission and try again.")
			getBans();
			async function getBans() {
				var banList = await message.guild.fetchBans()
				var banned = banList.has("id", user.id);
				if (!banned) return message.reply(":no_entry_sign: **NOPE**: That user isn't banned!");
				message.guild.unban(user, unban);
				message.reply(":white_check_mark: **OK**: " + user.username + " (" + user.id + ") has been **unbanned**.")
			}
		}).catch(function (reason) {
				throw reason;
		});
}

let command = 'ban'
, description = 'Ban a specified user from this server.'
, usage = 'ban **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
