const {get} = require("snekfetch");

exports.run = (bot, message) => {
	message.delete();
    get("https://random.cat/meow").then(response => {
        message.channel.send(":white_check_mark: **OK:** :cat: **|** *Here is your random cat!*\n" + response.body.file);
    });
};

let command = 'cat'
, description = 'Displays a random image of a cat.'
, usage = '+cat'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
