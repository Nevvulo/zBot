exports.run = (client, message, args) => {
    var helpMessage = "**Fleece Police Commands only:**```\n" +
        "* mod [on|off]    		Queries moderation status.\n";

    helpMessage = helpMessage +
        "* filter [on|off]   	  Queries the chat filter.\n";

    helpMessage = helpMessage +
        "rm [number]       		Deletes a number of messages.\n" +
        "uinfo [user]      		Gets information about a user.\n" +
        "                  		You must mention the user in\n" +
        "                  		order to see their information.\n" +
        "warn [user] [reason]      Give a warning to a user.\n" +
        "ban [user] [reason]       Ban someone from the server.\n" +
        "say [message]	   	  Say something under the bot's name.\n" +
        "setgame [game]			Set what the bot is playing to whatever you want.\n" +
        "* panic     		      Toggles panic mode.\n" +
        "deletemessages    		Automatically removes bot messages after 10 seconds.\n" +
        "cancel            		Cancels a pending operation.\n" +
        "help              		Prints this help message.\n" +
        "reboot            		Asks XailBot to reconnect.\n" +
        "\n" +
        "* = denotes an admin only command\n" +
        "These commands need to be prefixed with mod:\n" +
        "```";
    message.delete();
    message.channel.send(helpMessage);
}