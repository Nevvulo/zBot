var coin = "";

exports.run = (client, message, args) => {
	message.delete();

    switch (Math.floor(Math.random() * 1000) % 2) {
			case 0:
				coin = "heads";
				break;
			case 1:
				coin = "tails";
				break;
		}

		let randomPhrase = ["Looks like it's **" + coin + "** this time.", "It's **" + coin + "**.", "Alright, it's landed on **" + coin + "**.", "Oh! Would you look at that? The coin's landed on **" + coin + "**!"];
		let phrase = randomPhrase[Math.floor(Math.random() * randomPhrase.length)];

		message.reply(":white_circle: **COIN FLIP**: " + phrase)
};

let command = 'flip'
, description = 'Flips a coin.'
, usage = 'flip'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
