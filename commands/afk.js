const afk = require('./../bot.js');

exports.run = (client, message, args) => {
doNotDelete = true;

if (afk.userAFK.includes(message.author.id)) {
	message.reply(":white_check_mark: **OK:** You are no longer AFK.").then(message => {
        message.delete({ timeout: 8000 });
      });;
	var index = afk.userAFK.indexOf(message.author.id);
	if (index !== -1) {
		afk.userAFK.splice(index, 1);
	}
	message.delete();
	return;
}

message.reply(":white_check_mark: **OK:** I've set your status to AFK. If people mention you in their message, I'll notify them that you are AFK.").then(message => {
        message.delete({ timeout: 8000 });
      });
afk.userAFK.push(message.author.id);
message.delete();
return;
}

let command = 'afk'
, description = 'Toggle your AFK status in zBot.'
, usage = '+afk'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
