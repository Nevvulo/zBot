const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
  play();
function play() {
const voiceChannel = message.member.voiceChannel;
  voiceChannel.join()
  .then(connection => {
	return connection.playFile('C://Users//Blake//Desktop//Xail Bot//website//audio//konami.mp3', {volume: 0.5});
	}).then(dispatcher => {
dispatcher.on('end', () => {
		play();
	});
})
}
}
