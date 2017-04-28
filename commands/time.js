exports.run = (client, message, args) => {
var localtime = new Date();

	var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
	var dateString = date.toString();

	localtime.setTime(localtime.getTime() + (60 * 60 * 1000));
	message.channel.send(':arrow_forward: The time now is ' + dateString);
	message.delete();
}