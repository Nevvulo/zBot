exports.run = (client, message, args) => {
message.delete();
message.channel.send("hold on");
}

let command = 'credits'
, description = 'Shows credits and information relating to people who have contributed to zBot.'
, usage = '+credits'
, throttle = {usages: 1, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
