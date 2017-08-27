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

	if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}

	args = args.toString();


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

			var canvas = new Canvas(300, 90)
				var ctx = canvas.getContext('2d')
			const cond = new Image();

			const generate = () => {

				function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }


				// Environment Variables
				ctx.scale(1, 1);
				ctx.patternQuality = 'billinear';
				ctx.filter = 'bilinear';
				ctx.antialias = 'subpixel';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;

				// Username
				ctx.font = '16px Roboto';
				ctx.fillStyle = message.member.displayHexColor;
				ctx.fillText(message.member.displayName + " says:", 75, 35);

				// Message
				var maxWidth = 275;
				var context = ctx;
				var lineHeight = 13;
				var x = 75;
				var y = 55;
				var text = messagesay;

				ctx.font = '12px Roboto';
				ctx.fillStyle = "#FFF";

				wrapText(context, text, x, y, maxWidth, lineHeight);

				// Image
				ctx.beginPath();
				ctx.arc(40, 45, 25, 0, 2 * Math.PI, true);
				ctx.closePath();
				ctx.clip();
				ctx.shadowBlur = 5;
				ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
				ctx.drawImage(cond, 15, 20, 50, 50);
			};

			cond.src = await request({
					uri: message.member.user.avatarURL() ? message.member.user.avatarURL( {format: 'png'} ) : message.member.user.displayAvatarURL,
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
}

let command = 'isay'
, description = 'Displays your message in an image.'
, usage = 'isay **[message]**'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
