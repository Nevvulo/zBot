const Experience = require('./../structures/profile/Experience');
const Canvas = require('canvas');
const userStats = require('./../bot.js');
const path = require('path');
const request = require('request-promise');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite');

exports.run = (client, message, args) => {
	var messagesay = "";
	var argsArray = message.content.split(" ").slice(1);
	var arrayLength = argsArray.length;

	if (arrayLength > 1) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}

	if (args == "") {
		args = args.toString();
		args = message.author.id;
	} else {
	function getUserID(user) {
		var u = user;
		if (user.user != null) {
			u = user.user;
		}
		return u.id;
	}
	args = args.toString();
	args = args.replace(",", " ").replace(",", " ").replace(",", " ").toString();

	console.log(args.split(" ", 1).toString());
	if (!args.split(" ", 1).toString().includes("<")) {
		var foundUsers = client.users.findAll("username", args.split(" ", 1).toString());
		if (foundUsers.length == 0) {
			message.channel.send(':no_entry_sign: **ERROR:** Couldn\'t find anyone with that username. You might want to try again.');
			return;
		} else {
			for (let user of foundUsers) {
				args = getUserID(user);
			}
		}
	} else {
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
		console.log("Username not provided for arguments.");
	}
}

message.guild.fetchMember(args).then(function (member) {
		async function drawStats() {
			message.delete ();

			function fontFile(name) {
				return path.join(__dirname, '..', '/assets/', 'stats', 'fonts', name)
			}

			Canvas.registerFont(fontFile('UniSansHeavy.ttf'), {
				family: "Uni Sans CAPS"
			}) // eslint-disable-line max-len
			Canvas.registerFont(fontFile('Roboto.ttf'), {
				family: 'Roboto'
			}) // eslint-disable-line max-len
			const Image = Canvas.Image;

			var canvas = new Canvas(100, 100)
				var ctx = canvas.getContext('2d')
				const base = new Image();
			const cond = new Image();

			const generate = () => {

				// Environment Variables
				ctx.drawImage(base, 0, 0, 300, 300);
				ctx.scale(1, 1);
				ctx.patternQuality = 'billinear';
				ctx.filter = 'bilinear';
				ctx.antialias = 'subpixel';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;

				var lingrad = ctx.createLinearGradient(0, 0, 0, 150)
				var color=-25;
				lingrad.addColorStop(0, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')
				lingrad.addColorStop(0.5, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')
				lingrad.addColorStop(1, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')

				console.log(args)
				if (messagesay.includes("gradient")) {
				// assign gradients to fill and stroke styles
				ctx.fillStyle = lingrad
				ctx.fillRect(0, 0, 130, 130)
				ctx.strokeRect(0, 0, 100, 100)
				ctx.globalAlpha = 0.5
				}

				if (messagesay.includes("upsidedown")) {
				  ctx.translate(canvas.width,canvas.height);
				  ctx.rotate(180*Math.PI/180);
				}

				if (messagesay.includes("saturation")) {
					ctx.fillStyle = 'hsl('+ 360*Math.random() +',100%,100%)';
					ctx.globalAlpha = 0.5;
					ctx.fillRect(0, 0, 130, 130)
					ctx.strokeRect(0, 0, 100, 100)
				}
				// Image
				ctx.shadowBlur = 5;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';

				ctx.drawImage(cond, 0, 0, 100, 100);
				ctx.globalAlpha = 1;
			};

			base.src = await fs.readFileAsync('./assets/profile/backgrounds/Empty.png');
			cond.src = await request({
					uri: member.user.avatarURL() ? member.user.avatarURL( {format: 'png'} ) : member.user.displayAvatarURL,
					encoding: null
				});

			generate();

			return message.channel.send({
				files: [{
						attachment: canvas.toBuffer(),
						name: 'stats.png'
					}
				]
			});
		}

				drawStats();
	});
}

let command = 'pfp'
, description = 'When activated, deletes all incoming messages in this guild.'
, usage = '+pfp (user) (upsidedown|gradient|saturation)'
, throttle = {usages: 2, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
