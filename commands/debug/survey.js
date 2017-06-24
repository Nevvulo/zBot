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
		color: 3191350,
		author: {
		name: "ꜱᴜʀᴠᴇʏ »  ",
		icon_url: message.author.displayAvatarURL
		},
		description: ":star2: " + message.author + " started a new survey.",
		fields: [
		{
		  name: '**Question**',
		  value: ":pencil: " + messagesay
		},
		{
		  name: '**Reward**',
		  value: ":credit_card: *This survey is worth* **" + args[0] + " EXP!**"
		}
		],
		timestamp: new Date()
		}});
message.delete();
}