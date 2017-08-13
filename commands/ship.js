
exports.run = (client, message, args) => {
doNotDelete = true;
var bshipName = message.member.displayName
var shipName = bshipName.substr("0", Math.floor(message.member.displayName.length / 2))
var bshipUser = message.guild.members.random().displayName
var shipUser = bshipUser.substr(Math.floor(bshipUser.length / 2))

message.channel.send(":ship: `" + shipName + shipUser + "`   *(**" + bshipName + " **and** " + bshipUser + "**)*");

message.delete();
return;
}
