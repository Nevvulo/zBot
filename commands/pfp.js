const Experience = require('./../structures/profile/Experience');
const Canvas = require('canvas');
const userStats = require('./../bot.js');
const path = require('path');
const request = require('request-promise');
const Discord = require('discord.js');
const UserFinder = require('./../structures/general/UserFinder.js')
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

	if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}
	let filter = ""
	//messagesay = messagesay.replace("--saturation", "").then(filter = "saturation").replace("--upsidedown", "").then(filter = "upsidedown").replace("--gradient", "").then(filter = "gradient")
console.log(messagesay)
	let user = UserFinder.getUser(messagesay).shift().id
	console.log(user)
message.guild.members.fetch(user).then(function (member) {
		async function drawStats() {
			message.delete ();

			const canvas = new Canvas(100, 100)
				var ctx = canvas.getContext('2d')
			const cond = new Image();

			const generate = () => {

				// Environment Variables
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
				if (messagesay.includes("--gradient")) {
				// assign gradients to fill and stroke styles
				ctx.fillStyle = lingrad
				ctx.fillRect(0, 0, 130, 130)
				ctx.strokeRect(0, 0, 100, 100)
				ctx.globalAlpha = 0.5
				}

				if (messagesay.includes("--upsidedown")) {
				  ctx.translate(canvas.width,canvas.height);
				  ctx.rotate(180*Math.PI/180);
				}

				if (messagesay.includes("--saturation")) {
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

			cond.src = await request({
					uri: member.user.avatarURL() ? member.user.avatarURL( {format: 'png'} ) : member.user.displayAvatarURL,
					encoding: null
				});

			generate();
			const embed = new Discord.MessageEmbed();
			embed.setAuthor(member.user.username + "'s Profile Picture » ", member.user.avatarURL( {format: 'png'} ));
			embed.setColor("#c64ed3");
			if (filter !== "") {
			embed.setDescription("The following filters were applied to this image: " + filter)
			}
			embed.attachFiles([{
					attachment: canvas.toBuffer(),
					name: 'stats.png'
				}
			])
			embed.setImage("attachment://stats.png")
			return message.channel.send({ embed });
		}

				drawStats();
	});
}

let command = 'pfp'
, description = 'When activated, deletes all incoming messages in this guild.'
, usage = 'pfp (user) (upsidedown|gradient|saturation)'
, throttle = {usages: 2, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
