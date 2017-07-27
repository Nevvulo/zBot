const {get} = require("snekfetch");

exports.run = (bot, message) => {
	message.delete();
    get("https://random.cat/meow").then(response => {
        message.channel.send(":white_check_mark: **OK:** :cat: **|** *Here is your random cat!*\n" + response.body.file);
    });
};
