const math = require('mathjs');
const moment = require('moment');

exports.run = (client, message, args) => {
message.delete();

var messagesay = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;
var parser = math.parser();

//CONVERSIONS
var date = Date.now();
var nowDate = moment().format('MMMM Do YYYY, h:mm:ss a');

parser.set('xail', math.unit('187.96cm')); // Xails actual height
parser.set('puma', math.unit('0 W')); // Puma has no energy
parser.set('blake', math.unit('60.96cm')); // In reference to Fakin It, where the question was "Say how tall you are in feet", and I answered 2.
parser.set('smol', math.eval('1.6 * 10^-35m')); // Planck length
parser.set('tnt', math.eval('4.184 * 10^9 J')); // The energy 1 tnt produces
parser.set('littleboy', math.eval('6 * 10^13 J')); // The energy a hiroshima bomb produces
parser.set('sun', math.eval('2.0 * 10^30 kg')); // The mass of the sun
parser.set('jiffy', math.eval('0.01 seconds')); // A tick in a computer
parser.set('now', nowDate); // A tick in a computer
parser.set('cuteness', math.eval('Infinity')); // A tick in a computer
parser.set('blakecuteness', math.eval('0')); // A tick in a computer
parser.set('pumas_game_library', math.eval('Infinity')); // A tick in a computer

if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}

try {
message.channel.send({
			embed: {
				color: 3191350,
				author: {
					name: "ᴍᴀᴛʜ ʀᴇꜱᴜʟᴛ »  ",
					icon_url: message.author.displayAvatarURL
				},
				fields: [{
						name: '**:inbox_tray: Input**',
						value: `\`\`\`js\n${messagesay}\n\`\`\``
					},
					{
						name: '**:outbox_tray: Output**',
						value: `\`\`\`js\n${parser.eval(messagesay)}\n\`\`\``
					}
				],
				timestamp: new Date()
			}
		})
} catch (err) {
message.reply(":no_entry_sign: **ERROR:** Error whilst calculating request. " + err);
return;
}
}
