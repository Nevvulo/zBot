const snekfetch = require("snekfetch");

exports.run = (client, message, args) => {
	message.delete();
    snekfetch.get("https://icanhazdadjoke.com/")
		.set('Accept', "text/plain")
		.then(res => {
      message.channel.send(":rofl: **DAD JOKE**: *" + res.text + "*");
    });
};

let command = 'dadjoke'
, description = 'Gives a random joke, for better or for worse.'
, usage = 'dadjoke'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
