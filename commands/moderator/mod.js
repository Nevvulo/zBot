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