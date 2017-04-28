exports.run = (client, message, args) => {
doNotDelete = true;
message.reply(":egg:");
message.delete();
commandProcessed = true;
}