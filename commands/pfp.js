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

	if (messagesay.indexOf("--") !== -1) {
		filter = messagesay.split("--")[1].trim();
		messagesay = messagesay.split("--")[0].trim();
	}


	var userArgs = UserFinder.getUser(messagesay).shift().id
	if (messagesay == "") {
		userArgs = message.author.id
	}



	client.users.fetch(userArgs).then(function (user) {
		if (filter == "") {
			message.delete()
			const embed = new Discord.MessageEmbed();
			embed.setAuthor(user.tag + "'s Profile Picture » ", user.displayAvatarURL( {format: 'png' } ));
			if (message.guild.members.exists("id", userArgs)) {
					message.guild.members.fetch(userArgs).then(function (member) {
			embed.setColor(member.highestRole.hexColor);
			});
			}
			embed.setImage(user.displayAvatarURL( {format: 'png', size: 1024} ))
			message.reply({ embed })
			return;
		}

		async function drawStats() {
			message.delete ();
			const Image = Canvas.Image;
			const canvas = new Canvas(1024, 1024)
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

				var lingrad = ctx.createLinearGradient(0, 0, 0, 1024)
				var color=0;
				lingrad.addColorStop(0, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')
				lingrad.addColorStop(0.5, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')
				lingrad.addColorStop(1, 'hsla('+(color=color+Math.floor(Math.random() * 360) + 1  %360)+', 50%, 50%, 1)')

				console.log(args)
				if (filter == "gradient") {
				// assign gradients to fill and stroke styles
				ctx.fillStyle = lingrad
				ctx.fillRect(0, 0, 1024, 1024)
				ctx.strokeRect(0, 0, 1024, 1024)
				ctx.globalAlpha = 0.5
				}

				if (filter == "upsidedown") {
				  ctx.translate(canvas.width,canvas.height);
				  ctx.rotate(180*Math.PI/180);
				}

				if (filter == "saturation") {
					ctx.fillStyle = 'hsl('+ 360*Math.random() +',100%,100%)';
					ctx.globalAlpha = 0.5;
					ctx.fillRect(0, 0, 1024, 1024)
					ctx.strokeRect(0, 0, 1024, 1024)
				}

				// Image
				ctx.shadowBlur = 5;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
				ctx.drawImage(cond, 0, 0, 1024, 1024);
				ctx.globalAlpha = 1;
			};

			cond.src = await request({
					uri: user.avatarURL( {size: 1024} ) ? user.avatarURL( {format: 'png', size: 1024} ) : user.displayAvatarURL,
					encoding: null
				});

			generate();
			const embed = new Discord.MessageEmbed();
			embed.setAuthor(user.tag + "'s Profile Picture » ", user.avatarURL( {format: 'png'} ));
			if (message.guild.members.exists("id", userArgs)) {
					message.guild.members.fetch(userArgs).then(function (member) {
			embed.setColor(member.highestRole.hexColor);
			});
			}
			if (filter !== "") {
			embed.setDescription("**FILTERS**: *" + filter + "*")
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
, description = 'Displays yours or another users profile picture, with optional parameters for a filter.'
, usage = 'pfp (user) --(upsidedown|gradient|saturation)'
, throttle = {usages: 3, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
