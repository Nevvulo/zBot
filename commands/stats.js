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
	args = args.toString();

	//USERNAME/MENTION SYSTEM
	if (args == "") {
		args = message.author.id;
	} else {
		function getUserID(user) {
			var u = user;
			if (user.user != null) {
				u = user.user;
			}
			return u.id;
		}

		args = args.replace(",", " ").replace(",", " ").replace(",", " ").toString();

		if (!args.includes("<")) {
			var foundUsers = client.users.findAll("username", args);
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
			const totalExp = await Experience.getTotalExperience(member.id);

			const level = await Experience.getLevel(member.id);
			const levelBounds = await Experience.getLevelBounds(level);
			const currentExp = await Experience.getCurrentExperience(member.id);

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

			var canvas = new Canvas(300, 120)
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

				// Username
				ctx.font = '16px Roboto';
				ctx.fillStyle = member.displayHexColor;
				ctx.fillText(member.displayName, 75, 35);

				// Role
				ctx.font = '12px Roboto';
				ctx.fillStyle = member.displayHexColor;
				ctx.fillText(member.highestRole.name.toUpperCase(), 75, 50);

				// EXP TITLE
				ctx.font = '22px Uni Sans Heavy CAPS';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#E5E5E5';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('EXP.', 150, 87);

				// EXP
				ctx.font = '16px Roboto';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#d1d1d1';
				ctx.shadowColor = 'rgba(0, 0, 0, 0)';
				ctx.fillText(`${currentExp}/${levelBounds.upperBound - levelBounds.lowerBound}`, 150, 105);

				// LVL
				ctx.font = '22px Uni Sans Heavy CAPS';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#E5E5E5';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('LVL.', 74, 87);

				// LVL Number
				ctx.font = '19px Roboto';
				ctx.fillStyle = '#E5E5E5';
				ctx.fillText(`${level}`, 74, 107);

				// Image
				ctx.beginPath();
				ctx.arc(40, 40, 25, 0, 2 * Math.PI, true);
				ctx.closePath();
				ctx.clip();
				ctx.shadowBlur = 5;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
				ctx.drawImage(cond, 15, 15, 50, 50);
			};

			base.src = await fs.readFileAsync('./assets/stats/backgrounds/default.png');
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

let command = 'stats'
, description = 'A simplified version of the `profile` command.'
, usage = '+stats (user)'
, throttle = {usages: 3, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
