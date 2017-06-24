const Canvas = require('canvas');
const path = require('path');
const request = require('request-promise');
const {	promisifyAll } = require('tsubaki');
const fs = promisifyAll(require('fs'));
const sql = require('sqlite');
sql.open('./score.sqlite');

exports.run = (client, message, args) => {
	args = args.toString();
	args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

	if (args == "") {
		args = message.author.id;
	} else {
		args = args.split(" ");
	}

	message.guild.fetchMember(args.toString()).then(function(member) {
		async function drawStats() {
			message.delete();

			function fontFile(name) {
				return path.join(__dirname, '..', '..', '/assets/', 'stats', 'fonts', name)
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
				ctx.drawImage(base, 0, 0, 100, 100);
				ctx.scale(1, 1);
				ctx.patternQuality = 'billinear';
				ctx.filter = 'bilinear';
				ctx.antialias = 'subpixel';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;

				// Username
				ctx.font = '14px Roboto';
				ctx.fillStyle = member.displayHexColor;
				ctx.textAlign = 'center';
				ctx.fillText(member.displayName, 50, 50);
				
				// Username
				if (member.displayName.length > 10) {
					ctx.font = '10px Roboto';
				}
				ctx.font = '14px Roboto';
				ctx.textAlign = 'center';
				ctx.fillText("Pls", 50, 60);
			};

			base.src = await fs.readFileAsync('./assets/stats/backgrounds/default2.png');
			cond.src = await request({
				uri: member.user.avatarURL() ? member.user.avatarURL('png') : member.user.displayAvatarURL,
				encoding: null
			});

			generate();

			return message.channel.send({
				files: [{
					attachment: canvas.toBuffer(),
					name: 'pls.png'
				}]
			});
		}

		drawStats();

	});
}