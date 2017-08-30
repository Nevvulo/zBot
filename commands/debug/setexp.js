const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite');
var debug = false;

exports.run = (client, message, args) => {
	message.delete();
	var num = args[1];
	args = args[0]
	//USERNAME/MENTION SYSTEM
	if (args == "") {
		args = message.author.id;
	}
	args = args.toString();
	args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
	console.log(args);
	console.log(num);
	message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
	sql.get(`SELECT * FROM experience WHERE userId ='${member.id}' AND guild = '${message.guild.id}'`).then(row => {
		sql.run(`UPDATE experience SET experience = ${num} WHERE userId = ${member.id} AND guild = ${message.guild.id}`);
		message.channel.send(":white_check_mark: **OK:** I've updated " + member + "'s experience to " + num + ".");
	})
	})
}
