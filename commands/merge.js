exports.run = (client, message, args) => {
doNotDelete = true;
var arr0 = message.member.displayName.split('');
var arr1 = message.member.displayName.split('');
var arr2 = message.guild.members.random().displayName.split('');
var randNum = 2

var arrayCombined = arr0.map(function(v, i) {
return [v, arr2[i]];
});

function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var name2 = arr2.toString().replace(/,/g, "").slice(arr1.length);

if (arr2.toString().replace(/,/g, "").length < arr1.length) {
	name2 = arr2.toString().replace(/,/g, "").slice(0);
	randNum = 3;
}

message.channel.send(":ship: `" + arr1.toString().replace(/,/g, "").slice(0, arr1.length / randNum) + name2 + "`   *(**" + arr1.toString().replace(/,/g, "") + " **and** " + arr2.toString().replace(/,/g, "") + "**)*");

message.delete();
return;
}
