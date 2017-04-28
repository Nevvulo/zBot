var permitMember = {};

function permitRemove() {
    permitMember.removeRole(permitMember.guild.roles.get("304207299646586882"));
    console.log("Permitted role revoked.");
}

exports.run = (client, message, args) => {
doNotDelete = true;
args = args.toString();
args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

var num = 180000
message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
	permitMember = member;
	message.channel.send(":white_check_mark: **" + permitMember.displayName + "** is now permitted to post *any* links for 3 minutes.");
	permitMember.addRole(permitMember.guild.roles.get("304207299646586882"));
	console.log("Permitted role assigned.");
	client.setTimeout(permitRemove, num);
	message.delete();
}).catch(function(reason) {
	console.log(reason);
	if (permitMember == null) {
			message.reply(':no_entry_sign: **ERROR:** You need to enter a user to permit. See mod:help for more information.');
			message.delete();
			return;
			}
	
	switch (Math.floor(Math.random() * 1000) % 4) {
		case 0:
			message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
			break;
		case 1:
			message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
			break;
		case 2:
			message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
			break;
		case 3:
			message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
			break;
	}
});
}