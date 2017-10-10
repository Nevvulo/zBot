const Settings = require('./../structures/general/Settings.js');

exports.run = async (client, message, args) => {
    message.delete();
    if (await Settings.getValue(message.guild, "expletiveFilter") == true || await Settings.getValue(message.guild, "spamFilter") == true) {
        message.channel.send(':arrow_forward: **Moderation** has been toggled off.');
        await Settings.editSetting(message.guild, "expletiveFilter", false)
        await Settings.editSetting(message.guild, "spamFilter", false)
    } else {
        message.channel.send(':arrow_forward: **Moderation** has been toggled on.');
        await Settings.editSetting(message.guild, "expletiveFilter", true)
        await Settings.editSetting(message.guild, "spamFilter", true)
    }
}

let command = 'mod'
, description = 'Toggles moderation on/off for this guild.'
, usage = 'mod'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
