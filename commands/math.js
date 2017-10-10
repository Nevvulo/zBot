const math = require('mathjs');
const moment = require('moment');
const Discord = require('discord.js');

exports.run = (client, message, args) => {
message.delete();

var messagesay = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;
var parser = math.parser();

//CONVERSIONS
var date = Date.now();
var nowDate = moment().format('MMMM Do YYYY, h:mm:ss a');

parser.set('blake', math.unit('60.96cm')); // In reference to Fakin It, where the question was "Say how tall you are in feet", and I answered 2.
parser.set('smol', math.eval('1.6 * 10^-35m')); // Planck length
parser.set('tnt', math.eval('4.184 * 10^9 J')); // The energy 1 tnt produces
parser.set('littleboy', math.eval('6 * 10^13 J')); // The energy a hiroshima bomb produces
parser.set('sun', math.eval('2.0 * 10^30 kg')); // The mass of the sun
parser.set('jiffy', math.eval('0.01 seconds')); // A tick in a computer
parser.set('now', nowDate); // A tick in a computer
parser.set('friends', 'none'); // A tick in a computer
parser.set('victor', math.eval('999')); // A tick in a computer

if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}

if (message.content.length > 1014) {
	return message.reply(":no_entry_sign: **NOPE**: Your equation is too long to calculate. Try again, or simplify your equation.")
}

try {
	const embed = new Discord.MessageEmbed()
message.channel.send({
			embed: {
				color: 8359053,
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
	message.reply(":no_entry_sign: **ERROR**: An error occured whilst running the command. " + err.toString())
return;
}
}

let command = 'math'
, description = 'Math evaluation command.'
, usage = 'math **[equation]**'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
