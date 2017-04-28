exports.run = (client, message, args) => {
doNotDelete = false;
message.channel.send(
	"Here are some things you can try:\n```\n" +
	"copyright                                           Tells you about XailBot's copyright and license.\n" +
	"warranty                                            Tells you about XailBot's warranty.\n\n" +
	"egg                                                 Have an egg.\n" +
	"ping|pong                                           Asks XailBot to reply with a message.\n" +
	"music [link to video | queue | next | skip]         Plays music when given a YouTube link.\n" +
	"8ball [message]                                     An 8 ball which can tell your future and other information.\n" +
	"afk                                                 Notifies people if you are mentioned whilst AFK.\n\n\n" +
	"All of these commands need to be prefixed with 'bot:'.\n" +
	"```");
message.delete();
}