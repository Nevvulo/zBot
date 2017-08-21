var panicMode = false;

exports.run = (client, message, args) => {
    if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {

        if (panicMode == false) {
            message.channel.send(':rotating_light: **Panic mode is now on.** All message sending for this server has been turned off.');
            panicMode = true;
            console.log("? Panic is now on.");
            message.delete();
        } else {
            message.channel.send(':rotating_light: Panic mode is now off.');
            panicMode = false;
            console.log("? Panic is now off.");
            message.delete();
        }

    } else {
        message.reply(':no_entry_sign: **NOPE:** This is a administrator only command.');
        message.delete();
    }

    exports.enabled = panicMode;
}

let command = 'panic'
, description = 'When activated, deletes all incoming messages in this guild.'
, usage = '+panic'
, throttle = {usages: 2, duration: 10}
, permission = 'admin';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
