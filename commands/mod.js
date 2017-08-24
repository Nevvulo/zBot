const Settings = require('./../structures/general/Settings.js');

exports.run = (client, message, args) => {
    message.delete();
    if (Settings.getValue(message.guild, "expletiveFilter") == true || Settings.getValue(message.guild, "spamFilter") == true) {
        message.channel.send(':arrow_forward: **Moderation** has been toggled off.');
        Settings.editSetting(message.guild, "expletiveFilter", false)
        Settings.editSetting(message.guild, "spamFilter", false)
    } else {
        message.channel.send(':arrow_forward: **Moderation** has been toggled on.');
        Settings.editSetting(message.guild, "expletiveFilter", true)
        Settings.editSetting(message.guild, "spamFilter", true)
    }
}

let command = 'mod'
, description = 'Toggles moderation on/off for this guild.'
, usage = '+mod'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
