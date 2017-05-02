exports.run = (client, message, args) => {
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
        "These commands need to be prefixed with mod:\n" +
        "```";
    message.delete();
    message.channel.send(helpMessage);
}