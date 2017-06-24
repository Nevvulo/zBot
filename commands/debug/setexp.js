const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require('sqlite');
sql.open('./score.sqlite');
var debug = false;

exports.run = (client, message, args) => {
	var num = args[1];
	console.log(args);

	
	//USERNAME/MENTION SYSTEM
	if (args == "") {
		args = message.author.id;
	}
	console.log(args);
	args = args[0]
	args = args.toString();
	args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
	console.log(args);
	console.log(num);
	message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
	sql.get(`SELECT * FROM scores WHERE userId ='${member.id}'`).then(row => {
		sql.run(`UPDATE scores SET experience = ${num} WHERE userId = ${member.id}`);
		message.channel.send(":white_check_mark: **OK:** I've updated " + member + "'s experience to " + num + ".");
	})
	})
}