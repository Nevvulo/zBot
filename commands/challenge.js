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
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));

if (!badgesC[message.author.id])
			badgesC[message.author.id] = {
				weapon: "none"
			};
var userChallenge = badgesC[message.author.id];

eval(`userChallenge.weapon = "none"`);
		fs.writeFile('./data/challenge/equipment.json', JSON.stringify(badgesC, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});

message.delete ();

// Init Variables
if (challenge.startedChallenge == "false") {
challengeInProgress = false;
}

if (challengeInProgress) {
	message.reply(":no_entry_sign: **NOPE**: There is a challenge currently in progress.");
	return;
}

if (args[0] == "begin") {
if (message.author.id == challengePending) {
	if (message.mentions.users.first().id == waitingOnEnemyResponse) {
		message.guild.members.fetch(waitingOnEnemyResponse.toString()).then(function(enemy) {

			const voiceChannel = message.member.voiceChannel;
				voiceChannel.join()
				.then(connection => {
				return connection.playFile('./assets/challenge/audio/challenge.mp3', {volume: 0.6});
				}).then(dispatcher => {
				dispatcher.on('error', console.log);
			}).catch(console.log);

		var dms = true
		exports.challengeInDMS = dms
		exports.startedChallenge = "true";
		exports.enemy = enemy;
		exports.author = message.author;
		exports.channel = message.channel.name;

		function sendBoth(messageToSend) {
	  players = [client.users.get(message.author.id), client.users.get(enemy.id)]
	  for (i in players) {
	  players[i].send(messageToSend)
	  }
	  }

		challengeInProgress = true;
		if (!dms) {
		if (userChallenge.weapon == "gold") {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");
		} else {
		message.channel.send(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
		}
		return;
	} else {
		if (userChallenge.weapon == "gold") {
		sendBoth(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");
		} else {
		sendBoth(":crossed_swords: **CHALLENGE**: It is " + message.author + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
		}
		return;
	}

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
var person = args[1].toString();
person = person.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
message.guild.members.fetch(person).then(function(member) {
if (!(challengePending.indexOf(member.id) > -1)) {
message.reply(":no_entry_sign: **ERROR**: You don't have a pending challenge request from that user.");
return;
// If the user was found in the array, begin game.
} else {
message.reply(":crossed_swords: **CHALLENGE**: " + message.author + " has accepted " + member + "'s challenge!\n" + member + " can now start the battle by using `+challenge begin @" + message.author.tag + "`.");
challengeRequestFulfilled = true;
return;
}
}).catch (function (reason) {
	message.reply(":no_entry_sign: **ERROR**: You need to specify which user's challenge you are accepting by mentioning them. (ie. `+challenge accept @" + message.author.tag + "`)");
	return;
});
return;
}

var author = message.author
var enemy = message.mentions.users.first()

if (enemy == author) {
message.reply(":no_entry_sign: **NOPE**: You can't challenge yourself!");
return;
}


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

let command = 'challenge'
, description = 'Challenge somebody to a dual.'
, usage = 'challenge **[mention]**'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
