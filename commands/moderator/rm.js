exports.run = (client, message, args) => {
 doNotDelete = false;

var num = parseInt(args);
console.log(args);

if (num != args) {
	message.channel.send(":no_entry_sign: **ERROR:** That's not a number...");
} else {
	num = num + 1; //Also remove the mod:rm command
	message.channel.bulkDelete(num).then(function() {

		message.channel.send(":white_check_mark: **OK:** I successfully deleted " + parseInt(num - 1) + " messages.");
		numDel = parseInt(num - 1);
	}).catch(function(reason) {
		console.log(reason);
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

}