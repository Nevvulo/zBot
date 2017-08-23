const Settings = require('./../structures/general/Settings.js');

exports.run = (client, message, args) => {
message.delete();

let argument = args[0]
let setting = args[1]
let value = args[2]

if (argument == "view") {
  if (setting == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a setting to view.");
  if (Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `+config settings` to see all of the available settings you can view.");
  message.channel.send(":white_check_mark: **OK**: The current value for the setting *" + setting + "* is: __" + Settings.getValue(message.guild, setting) + "__")
}

if (argument == "set") {
  if (setting == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a setting to edit.");
  if (value == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a new value to this setting.");
  if (Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `+config settings` to see all of the available settings you can view.");
  if (setting == "expletiveFilter" || setting == "spamFilter" || setting == "musicNPModule" && typeof(value) !== "boolean") return message.channel.send(":no_entry_sign: **ERROR**: You can only change this setting to one of the following values: __true__ or __false__.");

  if (setting == "modLogsChannel" || setting == "memberLogsChannel") {
    console.log(value)
  if (!message.guild.channels.exists("name", value)) {
      message.channel.send(":no_entry_sign: **NOPE**: That channel doesn't exist. Try again.");
  } else {
      var channel = message.guild.channels.find("name", value);
      console.log(channel.id)
      if (channel.type != "text") {
          message.channel.send(":no_entry_sign: **NOPE**: That's not a text channel.");
      } else {
          if (setting == "modLogsChannel") {
          message.channel.send(":white_check_mark: **OK**: I've set moderator logs to be sent to <#" + channel.id + ">.")
          Settings.editSetting(message.guild, setting, channel.id);
          Settings.saveConfig()
          return;
          } else {
          message.channel.send(":white_check_mark: **OK**: I've set member alerts to be sent to <#" + channel.id + ">.")
          Settings.editSetting(message.guild, setting, channel.id);
          return;
          }
      }
    }
  }

  Settings.editSetting(message.guild, setting, value)
  message.channel.send(":white_check_mark: **OK**: I've set the setting *" + setting + "* to __" + value + "__.")
}


if (argument == "settings") {
  message.channel.send(":white_check_mark: **OK**: Here are all of the possible editable settings in zBot:\n**expletiveFilter** **spamFilter** **moderatorRoleID** **musicNPModule** **logsChannelID**")
}

}

let command = 'config'
, description = 'Allows you to change the configuration of zBot.'
, usage = '+config'
, throttle = {usages: 2, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
