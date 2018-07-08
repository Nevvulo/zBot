exports.settings = {command: "lock", description: "Lockdown a specific channel in this server.", usage: "kick (user) [reason]", throttle: {usages: 2, duration: 10},
	permission: {command: "mod", user: "KICK_MEMBERS"} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const defaultRole = Find.role(message.guild.id, message.guild)[0];
	const channel = Find.channel(args.slice(0).join(' ') || message.channel.id, message.guild)[0];
	const channelType = (channel.type === "text" ? "SEND_MESSAGES" : (channel.type === "category" ? "SEND_MESSAGES" : "CONNECT"));
  if (message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES") === false) return true;

  const permOverwrite = channel.permissionOverwrites.get(defaultRole.id);
  const locked = permOverwrite ? permOverwrite.denied.has(channelType) : false;
	client.util.log(defaultRole.name);
	client.util.log(channel.name)
  channel.overwritePermissions(defaultRole, { [channelType]: locked }, locked ? `[ ${message.author.tag} ] Channel unlocked.` : `[ ${message.author.tag} 	] Channel locked.`)
      .then(() => !locked)
			.catch(() => message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to change channel overrides on ${channel == message.channel ? "this" : "that"} channel.`));
	console.log(locked)
	return message.channel.zend(`${client.util.emoji("ok", message.guild)} \`@everyone\` ${locked ? "can now" : "no longer has access to"}` +
  ` ${channelType == "CONNECT" ? "connect to " : "chat in"} \`${channel.name}\`.`)
}
