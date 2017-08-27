var deleteEverythingConfirm = false;

exports.run = (client, message, args) => {
 doNotDelete = false;

if (args.toString() == "bot") {
const filter = msg => msg.author.bot == true;
message.delete();
		message.channel.fetchMessages({
			limit: 99
		}).then(messages => {
			const filteredMessages = messages.filter(filter);
			message.channel.bulkDelete(filteredMessages);
			message.channel.send(":white_check_mark: **OK:** I've deleted all messages created by zBot.").then(message => {
        message.delete({ timeout: 8000 });
      });
		})
	return;
}

if (args.toString() == "everything") {
if (deleteEverythingConfirm == false) {
message.channel.send(":no_entry: **HOLD UP:** Doing this command will result in this channel being **deleted**, then **re-created**. This will remove all messages. If you are aware of what this command will do, you can type `mod:rm everything` again.");
deleteEverythingConfirm = true;
message.delete();
return;
}
	message.channel.clone();
	message.channel.delete();

	var delchannel = message.channel;

	client.channels.get("196793479899250688").sendMessage(":white_check_mark: **OK:** I successfully deleted the channel you were just in and re-created it. All messages in the channel have been removed.").then(message => {
        message.delete({ timeout: 8000 });
      });
	return;
}

var num = parseInt(args);

if (num != args) {
	message.channel.send(":no_entry_sign: **ERROR:** That's not a number...");
} else {
	num = num + 1; //Also remove the mod:rm command
	message.channel.bulkDelete(num).then(function() {
		message.channel.send(":white_check_mark: **OK:** I successfully deleted " + eval(num - 1) + " messages.").then(message => {
        message.delete({ timeout: 8000 });
      });
	}).catch(function(reason) {
		console.log(reason);
		switch (Math.floor(Math.random() * 1000) % 4) {
			case 0:
				message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
				break;
			case 1:
				message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
				break;
			case 2:
				message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
				break;
			case 3:
				message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
				break;
		}
	});
}

}

let command = 'rm'
, description = 'Removes a specified amount of messages in the current channel.'
, usage = 'rm **[number 1-100]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
