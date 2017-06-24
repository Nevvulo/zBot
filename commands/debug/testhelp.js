exports.run = (client, message, args) => {
doNotDelete = true;
var messagesay = "";
var argsArray = message.content.split(" ").slice(2);
var arrayLength = argsArray.length;

if (arrayLength > 0) {
	for (let i = 0; i < arrayLength; i++) {
		messagesay = (messagesay + argsArray[i] + " ");
	}
	messagesay = messagesay.trim();
}

if (messagesay.includes("@everyone")) {
message.channel.send(":no_entry_sign: **NOPE:** You can't ping everyone!");
return;
}
		message.channel.send("<@&327739992904433664>").then(message => {
        message.delete({ timeout: 2000 });
      });
		message.channel.send({embed: {
		title: "ᴛᴇꜱᴛ ʜᴇʟᴘ » ",
		color: 3191350,
		author: {name: message.author.tag, icon_url: message.author.displayAvatarURL},
		description: ":star2: " + message.author + " is requesting help for testing something.",
		fields: [
		{
		  name: '**Query**',
		  value: ":pencil: " + messagesay
		},
		{
		  name: '**Reward**',
		  value: ":credit_card: *Helping test out this feature will grant you* **" + args[0] + " EXP!**"
		}
		],
		timestamp: new Date()
		}});
message.delete();
}