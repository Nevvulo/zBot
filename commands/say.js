exports.run = (client, message, args) => {
doNotDelete = true;
var messagesay = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;

if (arrayLength > 0) {
	for (let i = 0; i < arrayLength; i++) {
		messagesay = (messagesay + argsArray[i] + " ");
	}
	messagesay = messagesay.trim();
}

if (messagesay.includes("@everyone") || messagesay.includes("@here")) {
message.channel.send(":no_entry_sign: **NOPE:** You can't ping everyone!");
return;
}

message.channel.send(":warning: " + messagesay);
message.delete();
}

let command = 'say'
, description = 'Says a message under the bots name.'
, usage = '+say **[message]**'
, throttle = {usages: 4, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
