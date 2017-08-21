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
	let slots = JSON.parse(fs.readFileSync('./slots.json', 'utf8'));

	args = args.toString();
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
		args = args.replace(",", " ").replace(",", " ").replace(",", " ");

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
	let badgesP = JSON.parse(fs.readFileSync('./data/profile/profile-background.json', 'utf8'));

	// if the user has no badges, init to false.
		if (!slots[member.id])
			slots[member.id] = {
				slot1: "empty",
				slot2: "empty",
				slot3: "empty",
				slot4: "empty",
				slot5: "empty",
				slot6: "empty"
			};

	// if the user has no badges, init to false.
	if (!badgesP[member.id])
		badgesP[member.id] = {
			background: "default"
	};


	var userProfile = badgesP[member.id];


	sql.get(`SELECT * FROM experience WHERE userId ='${member.id}'`).then(row => {
		async function drawStats() {
			var uSlot = slots[member.id];
			message.delete ();

			//Fix error with late promise
			var totalExperience = `${row.experience}`;
			const totalExp = await Experience.getTotalExperience(member.id);
			const level = await Experience.getLevel(member.id);
			const levelBounds = await Experience.getLevelBounds(level);
			const currentExp = await Experience.getCurrentExperience(member.id);
			const fillValue = Math.min(Math.max(currentExp / (levelBounds.upperBound - levelBounds.lowerBound), 0), 1);

			function fontFile(name) {
				return path.join(__dirname, '..', '/assets/', 'profile', 'fonts', name)
			}

			Canvas.registerFont(fontFile('UniSansHeavy.ttf'), {
				family: "Uni Sans CAPS"
			}) // eslint-disable-line max-len
			Canvas.registerFont(fontFile('Roboto.ttf'), {
				family: 'Roboto'
			}) // eslint-disable-line max-len
			Canvas.registerFont(fontFile('Viga-Regular.otf'), {
				family: 'Viga'
			}) // eslint-disable-line max-len
			const Image = Canvas.Image;

			function randomColor(){
		  var r = Math.floor(Math.random()*100);
		  var g = Math.floor(Math.random()*100);
		  var b = Math.floor(Math.random()*100);
		  return "rgb("+ r + "," + g + "," + b +")";
			}

			var color=-25;
			function texter(str, x, y){
			  for(var i = 0; i <= str.length; ++i){
			      var ch = str.charAt(i);

						ctx.font = '16px Roboto';
			      ctx.fillStyle = 'hsla('+(color=color+25%360)+', 50%, 50%, 1)'
			      ctx.fillText(ch, x, y);
			      x += ctx.measureText(ch).width;
			  }
			}

			var canvas = new Canvas(300, 300)
			var ctx = canvas.getContext('2d')
			const base = new Image();
			const cond = new Image();
			const subbadge = new Image();
			const devbadge = new Image();
			const activebadge = new Image();
			const modbadge = new Image();
			const essaywriterbadge = new Image();
			const streamerbadge = new Image();
			const xbtbadge = new Image();
			const friendshipbadge = new Image();
			const photographerbadge = new Image();

			const generate = () => {
				// Environment Variables
				ctx.globalAlpha = 1
					ctx.drawImage(base, 0, 0, 300, 300);
				ctx.scale(1, 1);
				ctx.patternQuality = 'billinear';
				ctx.filter = 'bilinear';
				ctx.imageSmoothingEnabled = true;
				ctx.antialias = 'subpixel';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;

				// Username
				if (member.id == 184050823326728193 || member.id == 246574843460321291) {
					texter(member.displayName, 75, 35)
				} else if (member.highestRole.name == "@everyone") {
				ctx.font = '16px Roboto';
				ctx.fillStyle = "#FFF";
				ctx.fillText(member.displayName, 75, 35);
			} else {
			ctx.font = '16px Roboto';
			ctx.fillStyle = member.displayHexColor;
			ctx.fillText(member.displayName, 75, 35);
		}
				// Role
				if (member.highestRole.name == "@everyone") {
					ctx.font = '12px Roboto';
					ctx.fillStyle = "#FFF";
					ctx.fillText("NO ROLE", 75, 50);
				} else {
					ctx.font = '12px Roboto';
					ctx.fillStyle = member.displayHexColor;
					ctx.fillText(member.highestRole.name.toUpperCase(), 75, 50);
				}

				// EXP TITLE
				ctx.font = '22px Uni Sans Heavy CAPS';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#E5E5E5';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('EXP.', 74, 142);

				// EXP
				ctx.font = '16px Roboto';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#d1d1d1';
				ctx.shadowColor = 'rgba(0, 0, 0, 0)';
				ctx.fillText(`${currentExp}/${levelBounds.upperBound - levelBounds.lowerBound}`, 74, 160);

				// EXP
				ctx.font = '10px Roboto';
				ctx.textAlign = 'center';
				ctx.fillStyle = '#3498DB';
				ctx.shadowColor = 'rgba(0, 0, 0, 0)';
				ctx.fillRect(30, 225, 17, fillValue * -135);

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

				// TOTAL EXP TITLE
				ctx.font = '22px Uni Sans Heavy CAPS';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#E5E5E5';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('TOTAL EXP.', 74, 197);

				// TOTAL EXP
				ctx.font = '16px Roboto';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#d1d1d1';
				if (totalExp == "Error.") {
					ctx.fillStyle = '#c1453a';
				}
				ctx.shadowColor = 'rgba(0, 0, 0, 0)';
				ctx.fillText(totalExperience, 74, 215);

				//BADGES
				// BADGE TITLE
				ctx.font = '15px Uni Sans Heavy CAPS';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#E5E5E5';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('Badge Showcase', 25, 255);
				// Badges are spaced out +40 X for each badge
				let slot1X = 25;
				let slot2X = 65;
				let slot3X = 105;
				let slot4X = 145;
				let slot5X = 185;
				let slot6X = 225;

				// + SUBSCRIBER BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "subscriber") {
					ctx.drawImage(subbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + ACTIVE BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "active") {
					ctx.drawImage(activebadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + MODERATOR BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "moderator") {
					ctx.drawImage(modbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + ESSAYWRITER BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "essaywriter") {
					ctx.drawImage(essaywriterbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + XBT BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "xbt") {
					ctx.drawImage(xbtbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + FRIENDSHIP BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "friendship") {
					ctx.drawImage(friendshipbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + DEVELOPER BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "developer") {
					ctx.drawImage(devbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				// + PHOTOGRAPHER BADGE
				for (let i = 1; i < 7; i++) {
				if (eval(`uSlot.slot${i}`) == "photographer") {
					ctx.drawImage(photographerbadge, eval(`slot${i}X`), 260, 25, 25);
				}
				}

				if (eval(`uSlot.slot1`) == "empty") {
					if (eval(`uSlot.slot2`) == "empty") {
						if (eval(`uSlot.slot3`) == "empty") {
							if (eval(`uSlot.slot4`) == "empty") {
								if (eval(`uSlot.slot5`) == "empty") {
									if (eval(`uSlot.slot6`) == "empty") {
				ctx.font = '13px Roboto';
				ctx.textAlign = 'left';
				ctx.fillStyle = '#ba2a2a';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
				ctx.fillText('There doesn\'t seem to be anything here.', 25, 275);
									}
								}
							}
						}
					}
				}


				// Image
				ctx.globalAlpha = 1
				ctx.beginPath();
				ctx.arc(40, 40, 25, 0, 2 * Math.PI, true);
				ctx.closePath();
				ctx.clip();
				ctx.shadowBlur = 5;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
				ctx.drawImage(cond, 15, 15, 50, 50); //org 15, 15, 50, 50
			};

			base.src = await fs.readFileAsync(`./assets/profile/backgrounds/${userProfile.background}.png`);
			cond.src = await request({
					uri: member.user.avatarURL() ? member.user.avatarURL( {format: 'png'} ) : member.user.displayAvatarURL,
					encoding: null
				});
			subbadge.src = await fs.readFileAsync('./assets/profile/badges/subscriber.png');
			devbadge.src = await fs.readFileAsync('./assets/profile/badges/developer.png');
			modbadge.src = await fs.readFileAsync('./assets/profile/badges/moderator.png');
			activebadge.src = await fs.readFileAsync('./assets/profile/badges/active.png');
			essaywriterbadge.src = await fs.readFileAsync('./assets/profile/badges/essaywriter.png');
			streamerbadge.src = await fs.readFileAsync('./assets/profile/badges/streamer.png');
			xbtbadge.src = await fs.readFileAsync('./assets/profile/badges/xbt.png');
			friendshipbadge.src = await fs.readFileAsync('./assets/profile/badges/friendship.png');
			photographerbadge.src = await fs.readFileAsync('./assets/profile/badges/photographer.png');

			generate();

			return message.channel.send({
				files: [{
						attachment: canvas.toBuffer(),
						name: 'profile.png'
					}
				]
			});
		}

		drawStats();

	})
	})
}

let command = 'profile'
, description = 'Displays yours or another users profile.'
, usage = '+profile (user)'
, throttle = {usages: 3, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
