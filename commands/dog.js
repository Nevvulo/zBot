const {get} = require("snekfetch");

exports.run = (client, message, args) => {
	message.delete();
    get("https://random.dog/woof.json").then(res => {
        message.channel.send(":white_check_mark: **OK:** :dog: **|** *Here is your random doggo!*\n" + res.body.url);
    });
};

let command = 'dog'
, description = 'Displays a random image of a dog.'
, usage = 'dog'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
