const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('C://Users//Blake//Desktop//BOT//assets//music//audio//myleg.mp3', {volume: 3});
	}).then(dispatcher => {
	dispatcher.on('error', console.error);
		// You can also do things like dispatcher.pause() and dispatcher.end() here.
	}).catch(console.error);
}