const Discord = require('discord.js');
const Canvas = require('canvas');
const path = require('path');
const request = require('request-promise');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
const challenge = require('../bot.js');

var waitingOnEnemyResponse = []
var challengePending = []
var challengeRequestFulfilled = false;

var challengeInProgress = false;
exports.run = (client, message, args) => {

message.delete ();

var challengeEquipment = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));
	
if (!challengeEquipment[message.author.id])
			challengeEquipment[message.author.id] = {
				weapon: "none"
			};
			

// Init Variables

if (challengeInProgress) {
	message.reply(":no_entry_sign: **NOPE**: There is a challenge currently in progress.");
	return;
}

if (args[0] == "begin") {
if (message.author.id == challengePending) {
	if (message.mentions.users.first().id == waitingOnEnemyResponse) {
		message.guild.fetchMember(waitingOnEnemyResponse.toString()).then(function(enemy) {
		
		exports.startedChallenge = "true";
		exports.enemy = enemy;
		exports.author = message.author;
		exports.channel = message.channel.name;
		
		var userChallenge = challengeEquipment[message.author.id];
		
		if (userChallenge.weapon == "gold") {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");	
		} else {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
		}
		return;
		
		})
	} else {
		message.reply(":no_entry_sign: **ERROR**: You need to invite this person to a challenge first before you begin one.");
	}
} else {
	message.reply(":no_entry_sign: **ERROR**: You haven't started a challenge with anyone.");
}
return;
}


if (args[0] == "accept") {
// If the user hasn't specified a user, throw an error.
if (message.mentions.users.first() == undefined) {
message.reply(":no_entry_sign: **ERROR**: You need to specify which user's challenge you are accepting by mentioning them. (ie. `+challenge accept @" + message.author.tag + "`)");
return;
// If the user isn't in the array, don't do anything.
} else if (!(challengePending.indexOf(message.mentions.users.first().id) > -1)) {
message.channel.send("challengePending = " + challengePending);
message.reply(":no_entry_sign: **ERROR**: You don't have a pending challenge request from that user.");
return;
// If the user was found in the array, begin game.
} else {
message.reply(":crossed_swords: **CHALLENGE**: " + message.author + " has accepted " + message.mentions.users.first() + "'s challenge!\n" + message.mentions.users.first() + " can now start the battle by using `+challenge begin @" + message.author.tag + "`.");
challengeRequestFulfilled = true;
return;
}
}


if (message.mentions.users.first() == undefined) {
message.reply(":no_entry_sign: **ERROR**: You need to specify which user you want to challenge by mentioning them. (ie. `+challenge " + message.author.tag + "`)");
return;
} 

var author = message.author
var enemy = message.mentions.users.first()

if (enemy == author) {
message.reply(":no_entry_sign: **NOPE**: You can't challenge yourself!");
return;
}

//Idea:
//
// Make a text-based war game, similar in nature to Clash of Clans or Clash Royale, where you have a tower that can be
// upgraded using Rainbows, and there are enemies/minions who come to attack your tower. Overtime the difficulty of the
// enemies will get progressively harder, causing you to buy more upgrades with Rainbows. Additionally, you could complete
// certain challenges to either gain rainbows, or automatically upgrade your weaponry.

// Checks if they have challenged someone recently
	if (challengePending.includes(message.author.id)) {
		message.reply(":no_entry_sign: **NOPE**: You've already initiated a challenge request, please wait until your current request expires before trying again.");
		return;
	} else {
		
		message.channel.send(":crossed_swords: **CHALLENGE**: " + message.author + " has challenged " + enemy + " to battle!\n" + enemy + " has 60 seconds to accept this challenge by using `+challenge accept @" + message.author.tag + "`, or ignore it.");
		
		// Adds the user to the array so that they can't challenge someone for 60 seconds
		challengePending.push(message.author.id);
		waitingOnEnemyResponse.push(enemy.id);
		client.setTimeout(() => {
			const index = waitingOnEnemyResponse.indexOf(enemy.id);
			const index2 = challengePending.indexOf(message.author.id);
			// Removes the user from the array after 60 seconds
			waitingOnEnemyResponse.splice(index, 1);
			challengePending.splice(index2, 1);
		}, 60000);
	}
}