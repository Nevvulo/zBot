const warn = require('./warn.js');
const ban = require('./ban.js');
const mute = require('./mute.js');

exports.run = (client, message, args) => {
    doNotDelete = false;
    if (warn.warnMember != null) {
		message.channel.send(':white_check_mark: **OK**, I won\'t warn ' + warn.warnMember + ".");
        message.delete();
        warn.warnMember = null;
		exports.warnConfirm = false;
        return;
    } else if (banMember != null) {
        message.channel.send(':white_check_mark: **OK**, I won\'t ban ' + banMember.displayName);
        ban.banMember = null;
		exports.warn = "nope";
    } else if (muteMember != null) {
        message.channel.send(':white_check_mark: **OK**, I won\'t mute ' + muteMember.displayName);
        mute.muteMember = null;
		exports.warn = "nope";
    } else {
        message.reply(':no_entry_sign: **ERROR:** Nothing to cancel.');
    }
    message.delete();
}

let command = 'cancel'
, description = 'Cancels a pending action.'
, usage = 'cancel'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
