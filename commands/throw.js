exports.run = (client, message, args) => {
	message.delete();
    throw args.slice(0).join(' ');
};

let command = 'throw'
, description = 'Throws an error.'
, usage = 'throw'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
