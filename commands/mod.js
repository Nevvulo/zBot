var doModeration = true;

exports.run = (client, message, args) => {
    message.delete();
    if (doModeration) {
        message.channel.send(':arrow_forward: **Moderation** has been toggled off.');
        doModeration = false;
    } else {
        message.channel.send(':arrow_forward: **Moderation** has been toggled on.');
        doModeration = true;
    }

    exports.enabled = doModeration;
}

let command = 'mod'
, description = 'Toggles moderation on/off for this guild.'
, usage = '+mod'
, throttle = {usages: 3, duration: 10}
, permission = 'admin';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
