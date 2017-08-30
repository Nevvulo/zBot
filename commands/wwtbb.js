const Canvas = require('canvas');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const request = require('request-promise');
const Discord = require('discord.js');
const millionaire = require('./../structures/games/Millionaire.js');

var questionNum = 0;
var host = millionaire.host;
var q = millionaire.question;
var a1 = millionaire.answerOne;
var a2 = millionaire.answerTwo;
var a3 = millionaire.answerThree;
var a4 = millionaire.answerFour;
var cA = millionaire.correctAnswer;
var money = {};
var qworth = 0;
var randomask = "";

exports.run = (client, message, args) => {
  console.log(money)
  if (money[message.author.id] == undefined) {
    console.log("thing hppened")
  money[message.author.id] = 0;
  }
  var answer = "";
  var argsArray = message.content.split(" ").slice(1);
  var arrayLength = argsArray.length;

  if (arrayLength > 1) {
  	for (let i = 0; i < arrayLength; i++) {
  		answer = (answer + argsArray[i] + " ");
  	}
  	answer = answer.replace(argsArray[0], "");
  	answer = answer.trim();
  }

if (host == undefined) {
host = message.author.id;
exports.host = host
console.log("No host, defining default as " + message.author + ".");
}

message.guild.fetchMember(message.author).then(function(member) {

if (args.toString() == "commands") {
message.channel.send("**COMMANDS FOR WHO WANTS TO BE BANKRUPT:**\n+m setquestion [question]\n+m seta[1-4] [answer]\n+m setca [correct answer as letter]\n+m start\n+m final\n+m incorrect [users who are wrong]");
}


if (args.toString() == "intro") {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('./assets/wwtbam/audio/intro.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
	}).catch(console.error);
}

if (args.toString().startsWith("final")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('./assets/wwtbam/audio/final.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);
}

if (args.toString().startsWith("incorrect")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
var wrongPeeps = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		wrongPeeps = (wrongPeeps + argsArray[i] + " ");
	}
	wrongPeeps = wrongPeeps.replace(argsArray[0], "");
	wrongPeeps = wrongPeeps.trim();
}
message.channel.send(":no_entry_sign: **OH NO!** I am so sorry " + wrongPeeps + ", but the correct answer was __" + cA + "__!");

wrongPeeps = wrongPeeps.toString();
wrongPeeps = wrongPeeps.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
money[wrongPeeps] -= qworth;
console.log(wrongPeeps);

const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('./assets/wwtbam/audio/1lose.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);

}

if (args.toString().startsWith("correct")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
message.channel.send(":white_check_mark: **CORRECT!** The correct answer was __" + cA + "__.");
const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('./assets/wwtbam/audio/1win.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);
}

//SETTING UP TEAMS
if (args.toString().startsWith("team")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var team = args[2];
args = args.toString();
args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

message.guild.fetchMember(args).then(function(member) {

message.channel.send(":white_check_mark: **OK:** " + member.displayName + " has joined team **" + team + "**.");

})
}

//Checking money
if (args.toString().startsWith("money")) {
message.delete();
console.log(money);
message.reply(":white_check_mark: **OK:** You have **$" + money[message.author.id] + "**.");
}

//SETTING UP HOST
if (args.toString().startsWith("sethost")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
args = args.toString();
args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

message.guild.fetchMember(args).then(function(member) {

host = member.id
exports.host = member.id;
message.channel.send(":white_check_mark: **OK:** I've changed the host to " + member.displayName + ".");

})
}

if (args.toString().startsWith("start")) {
questionNum = questionNum + 1;

q = millionaire.question;
a1 = millionaire.answerOne;
a2 = millionaire.answerTwo;
a3 = millionaire.answerThree;
a4 = millionaire.answerFour;
cA = millionaire.correctAnswer;

if (questionNum == 1) {
	qworth = 100;
} else if (questionNum == 2) {
	qworth = 500;
} else if (questionNum == 3) {
	qworth = 1000;
} else if (questionNum == 4) {
	qworth = 2500;
} else if (questionNum == 5) {
	qworth = 5000;
} else if (questionNum == 6) {
	qworth = 10000;
} else if (questionNum == 7) {
	qworth = 100000;
} else if (questionNum == 8) {
	qworth = 250000;
} else if (questionNum == 9) {
	qworth = 500000;
} else if (questionNum == 10) {
	qworth = 1000000;
}
console.log(args);
message.channel.send("Welcome back to 'Who wants to be bankrupt?'. Next question is coming up right now for **$" + qworth + "**.");

		switch (Math.floor(Math.random() * 1000) % 9) {
		case 0:
			randomask = "**Let's see if you can answer this question.**";
			break;
		case 1:
			randomask = "**Good luck on this question.**";
			break;
		case 2:
			randomask = "**This one's a tough one.**";
			break;
		case 3:
			randomask = "**May the best man win.**";
			break;
		case 4:
			randomask = "**I'd be surprised if you get this one.**";
			break;
		case 5:
			randomask = "**This one should be pretty easy.**";
			break;
		case 6:
			randomask = "**If you're smart, this one should be a piece of cake.**";
			break;
		case 7:
			randomask = "**If you're clever, this one is a walk in the park.**";
			break;
      case 8:
  			randomask = "**I wish they'd have given you a hard question, this is too easy!**";
  			break;
		}

message.channel.send(randomask);

const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('./assets/wwtbam/audio/1active.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);
drawQuestion();
}

async function drawQuestion () {

const Image = Canvas.Image;

var canvas = new Canvas(1021, 235)
var ctx = canvas.getContext('2d')
const base = new Image();
const cond = new Image();


const generate = () => {

// Environment Variables
			ctx.drawImage(base, 0, 0, 1021, 235);
			ctx.scale(1, 1);
			ctx.patternQuality = 'billinear';
			ctx.filter = 'bilinear';
			ctx.antialias = 'subpixel';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
			ctx.shadowOffsetY = 2;
			ctx.shadowBlur = 3;

// Question
			ctx.font = '30px Century Gothic';
			ctx.textAlign = 'center';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText(q, 511, 66);

// Answer 1
			ctx.font = '25px Century Gothic';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText(a1, 120, 145);

// Answer 2
			ctx.font = '25px Century Gothic';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText(a2, 580, 145);

// Answer 3
			ctx.font = '25px Century Gothic';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText(a3, 120, 220);

// Answer 4
			ctx.font = '25px Century Gothic';
			ctx.textAlign = 'left';
			ctx.fillStyle = '#E5E5E5';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
			ctx.fillText(a4, 580, 220);
};

base.src = await fs.readFileAsync('./assets/wwtbam/images/question.png');
cond.src = await request({
			uri: member.user.avatarURL() ? member.user.avatarURL('png') : member.user.displayAvatarURL,
			encoding: null
		});

generate();

return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'millionaire.png' }] });
}
})
}

let command = 'wwtbb'
, description = 'wwtbb'
, usage = 'wwtbb **[user]** **[reason]**'
, throttle = {usages: 3, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
