const api = require('../../keys.js');

exports.run = (client, message, args) => {
doNotDelete = true;
message.delete();
message.channel.send(":white_check_mark: We'll be back in a bit.").then(function() {
	client.destroy();
	client.login(api.key()).then(function() {
		message.channel.send(":white_check_mark: XailBot is back online!");
	}).catch(function() {
		console.log("? [ERROR] Login failed.");
	});
});
}