var deleteEverythingConfirm = false;

exports.run = (client, message, args) => {
 doNotDelete = false;
var num = parseInt(args);

if (num > 99) {
  return message.reply(":no_entry_sign: **NOPE:** Unfortunately, I can't delete more than 99 messages at a time.");
}

if (num != args) {
	message.reply(":no_entry_sign: **ERROR:** You need to provide the amount of messages you want to delete.");
} else {
	num = num + 1; //Also remove the rm command
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
