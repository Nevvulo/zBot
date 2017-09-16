
exports.run = (client, message, args) => {
doNotDelete = true;
const user = args.slice(0).join(' ');

var bshipName = message.member.displayName
var shipName = bshipName.substr("0", Math.floor(message.member.displayName.length / 2))
var bshipUser = message.guild.members.random().displayName
var shipUser = bshipUser.substr(Math.floor(bshipUser.length / 2))

message.channel.send(":ship: `" + shipName + shipUser + "`   *(**" + bshipName + " **and** " + bshipUser + "**)*");

message.delete();
return;
}

let command = 'ship'
, description = 'Ships you with another random user.'
, usage = 'ship'
, throttle = {usages: 3, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
