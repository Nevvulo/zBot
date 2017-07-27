const {get} = require("snekfetch");

exports.run = (client, message, args) => {
	message.delete();
    get("https://random.dog/woof.json").then(res => {
        message.channel.send(":white_check_mark: **OK:** :dog: **|** *Here is your random doggo!*\n" + res.body.url);
    });
};
