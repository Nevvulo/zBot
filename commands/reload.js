exports.run = (client, message, args) => {
  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`The command ${args[0]} has been reloaded`);
};

let command = 'reload'
, description = 'Reloads a module'
, usage = 'reload (module)'
, throttle = {usages: 3, duration: 10}
, permission = 'dev'
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
