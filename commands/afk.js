exports.run = (client, message, args) => {
doNotDelete = true;

if (userAFK.includes(message.author.id)) {
	message.reply(":white_check_mark: **OK:** You are no longer AFK.");
	var index = userAFK.indexOf(message.author.id);
	if (index !== -1) {
		userAFK.splice(index, 1);
	}
	message.delete();
	return;
}

message.reply(":white_check_mark: **OK:** I've set your status to AFK. If people mention you in their message, I'll notify them that you are AFK.");
userAFK.push(message.author.id);
message.delete();
return;
}