const warn = require('./warn.js');
const ban = require('./ban.js');
const mute = require('./mute.js');

exports.run = (client, message, args) => {
    doNotDelete = false;
    if (warn.warnMember != null) {
		message.channel.send(':white_check_mark: **OK**, I won\'t warn ' + warn.warnMember + ".");
        message.delete();
        warn.warnMember = null;
		warn.warnConfirm = false;
        return;
    } else if (banMember != null) {
        message.channel.send(':white_check_mark: **OK**, I won\'t ban ' + banMember.displayName);
        banMember = null;
		exports.warn = "nope";
    } else if (muteMember != null) {
        message.channel.send(':white_check_mark: **OK**, I won\'t mute ' + muteMember.displayName);
        muteMember = null;
		exports.warn = "nope";
    } else {
        message.reply(':no_entry_sign: **ERROR:** Nothing to cancel.');
    }
    message.delete();
}