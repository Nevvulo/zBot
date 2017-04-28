var botDelMessage = false;

exports.run = (client, message, args) => {
    if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {

        if (botDelMessage == false) {
            message.channel.send(':rotating_light: Messages from the bot will now automatically be deleted.');
            botDelMessage = true;
            console.log("? Bot message deletion is now on.");
            message.delete();
        } else {
            message.channel.send(':rotating_light: Messages from the bot will no longer automatically be deleted.');
            botDelMessage = false;
            console.log("? Bot message deletion is now off.");
            message.delete();
        }

    } else {
        message.reply(':no_entry_sign: **NOPE:** This is a administrator only command.');
        message.delete();
    }

    exports.enabled = botDelMessage;
}