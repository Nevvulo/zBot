const Canvas = require('canvas');
const path = require('path');
const request = require('request-promise');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));

exports.run = (client, message, args) => {
		async function drawItems() {
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
			
			var canvas = new Canvas(1920, 1080)
			var ctx = canvas.getContext('2d')
			const base = new Image();

			const generate = () => {
				// Environment Variables
				ctx.drawImage(base, 0, 0, 1920, 1080);
				ctx.scale(1, 1);
				ctx.patternQuality = 'billinear';
				ctx.filter = 'bilinear';
				ctx.antialias = 'subpixel';
				ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;
			};

			base.src = await fs.readFileAsync('./assets/items/images/badges.png');
			
			generate();

			return message.channel.send({
				files: [{
						attachment: canvas.toBuffer(),
						name: 'items.png'
					}
				]
			});
		}

		drawItems();
}
