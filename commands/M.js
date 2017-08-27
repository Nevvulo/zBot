const Canvas = require('canvas');
const { promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const request = require('request-promise');
const Discord = require('discord.js');
const client = new Discord.Client();
const millionaire = require('./M.js');

var questionNum = 0;
var host = millionaire.host;
var q = millionaire.question;
var a1 = millionaire.answerOne;
var a2 = millionaire.answerTwo;
var a3 = millionaire.answerThree;
var a4 = millionaire.answerFour;
var cA = millionaire.correctAnswer;
var money = [];
var qworth = 0;
var randomask = "";

exports.run = (client, message, args) => {
if (millionaire.host == undefined) {
host = message.author.id;
console.log("No host, defining default as " + message.author + ".");
}

message.guild.fetchMember(message.author).then(function(member) {

if (args.toString() == "commands") {
message.channel.send("**COMMANDS FOR MILLIONAIRE:**\nbot:m setquestion [question]\nbot:m seta[1-4] [answer]\nbot:m setca [correct answer as letter]\nbot:m start\nbot:m final\nbot:m incorrect [users who are wong]");
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
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//wwtbam//audio//intro.mp3', {volume: 0.6});
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
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//wwtbam//audio//final.mp3', {volume: 0.6});
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
money[wrongPeeps] = money[wrongPeeps] - qworth;
console.log(wrongPeeps);

const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//wwtbam//audio//1lose.mp3', {volume: 0.6});
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
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//wwtbam//audio//1win.mp3', {volume: 0.6});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);
}

//SETTING UP TEAMS
if (args.toString().startsWith("team")) {
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
message.reply(":white_check_mark: **OK:** You have **$" + money[message.author] + "**.");
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

millionaire.host = member.id;
message.channel.send(":white_check_mark: **OK:** I've changed the host to " + member.displayName + ".");

})
}





//SETTING UP QUESTION
if (args.toString().startsWith("setquestion")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
console.log(args);
var question = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		question = (question + argsArray[i] + " ");
	}
	question = question.replace(argsArray[0], "");
	question = question.trim();
	q = question;
}

message.delete();
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

//SETTING UP ANSWER 1
if (args.toString().startsWith("seta1")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var ans1 = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		ans1 = (ans1 + argsArray[i] + " ");
	}
	ans1 = ans1.replace(argsArray[0], "");
	ans1 = ans1.trim();
	a1 = ans1;
}
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

//SETTING UP ANSWER 2
if (args.toString().startsWith("seta2")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var ans2 = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		ans2 = (ans2 + argsArray[i] + " ");
	}
	ans2 = ans2.replace(argsArray[0], "");
	ans2 = ans2.trim();
	a2 = ans2;
}
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

//SETTING UP ANSWER 3
if (args.toString().startsWith("seta3")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var ans3 = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		ans3 = (ans3 + argsArray[i] + " ");
	}
	ans3 = ans3.replace(argsArray[0], "");
	ans3 = ans3.trim();
	a3 = ans3;
}
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

//SETTING UP ANSWER 4
if (args.toString().startsWith("seta4")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var ans4 = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		ans4 = (ans4 + argsArray[i] + " ");
	}
	ans4 = ans4.replace(argsArray[0], "");
	ans4 = ans4.trim();
	a4 = ans4;
}
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

//SETTING UP CORRECT ANSWER
if (args.toString().startsWith("setca")) {
if (message.author.id !== host) {
message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
return;
}
message.delete();
console.log(args);
var corA = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 1) {
	for (let i = 0; i < arrayLength; i++) {
		corA = (corA + argsArray[i] + " ");
	}
	corA = corA.replace(argsArray[0], "");
	corA = corA.trim();
	cA = corA;
}

if (cA == "A") {
cA = a1;
} else if (cA == "B") {
cA = a2;
} else if (cA == "C") {
cA = a3;
} else if (cA == "D") {
cA = a4;
}
message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
}

exports.answerOne = a1;
exports.answerTwo = a2;
exports.answerThree = a3;
exports.answerFour = a4;
exports.question = q;
exports.correctAnswer = cA;


if (args.toString().startsWith("start")) {
questionNum = questionNum + 1;

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
message.channel.send("Welcome back to 'Who wants to be a millionaire?'. Next question is coming up right now for **$" + qworth + "**.");

		switch (Math.floor(Math.random() * 1000) % 8) {
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
		}

message.channel.send(randomask);

const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//wwtbam//audio//1active.mp3', {volume: 0.6});
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
