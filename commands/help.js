exports.run = (client, message, args) => {
doNotDelete = false;

if (args == "mod" || args == "moderator" && message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
    var helpMessage = "**Fleece Police Commands only:**```\n" +
        "* mod		    		Toggles moderation status.\n";

    helpMessage = helpMessage +
        "* filter			   	Toggles the chat filter.\n";

    helpMessage = helpMessage +
        "rm [number]       		Deletes a number of messages.\n" +
        "uinfo [user]      		Gets information about a user.\n" +
        "warn [user] [reason]      Give a warning to a user.\n" +
        "ban [user] [reason]       Ban someone from the server.\n" +
		"mute [user] [reason]       Mute somebody on the server.\n" +
		"softban [user] [reason]       Softban someone on the server.\n" +
        "say [message]	   	  Say something under the bot's name.\n" +
		"permit [user]	   	  Permit a user to post any links for 3 minutes.\n" +
        "setgame [game]			Set what the bot is playing to whatever you want.\n" +
        "* panic     		      Toggles panic mode.\n" +
        "deletemessages    		Automatically removes bot messages after 10 seconds.\n" +
        "cancel            		Cancels a pending operation.\n" +
        "help              		Prints this help message.\n" +
        "reboot            		Asks XailBot to reconnect.\n" +
        "\n" +
        "* = denotes an admin only command\n" +
		"The user argument currently only works when said user is mentioned.\n" +
        "These commands need to be prefixed with +\n" +
        "```";
    message.delete();
    message.channel.send(helpMessage);
	return;
}

message.channel.send(
	"Here are some things you can try:\n```\n" +
	"copyright                                           Tells you about Xail Bot's copyright and license.\n" +
	"warranty                                            Tells you about Xail Bot's warranty.\n" +
	"credits                                             Displays the people who have contributed to Xail Bot.\n\n" +

	"stats                                  			 Shows your statistics on Rainbow Gaming.\n" +
	"profile									         Gives a more detailed view of your statistics.\n" +
	"leaderboard <number>                                Shows a leaderboard of people with the most experience.\n" +
	"equip [slot] [item]                    			 Allows you to equip a badge in a specific slot.\n\n" +
	"hug [message]                                       Give somebody a hug!\n" +
	"ping|pong                                           Asks XailBot to reply with a message.\n" +
	
	"8ball [message]                                     An 8 ball which can tell your future and other information.\n" +
	"afk                                                 Notifies people if you are mentioned whilst AFK.\n" +
	"tag [tag]                                           Shows a person's tag.\n" +
	"info                                                Shows information about Xail Bot.\n" +	
	"help                                                Displays this help prompt.\n\n" +
	"All of these commands need to be prefixed with '+'.\n" +
	"```");
message.delete();
}
