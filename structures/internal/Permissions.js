const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const Settings = require('./../general/Settings.js');
const User = require('./../../models/user/User.js')
const Moderation = require('./../../models/general/Moderation.js')
const Tags = require('./../../models/general/Tags.js')

var developerOverrides = true;
var dev = ["246574843460321291"]

class Permissions {
	static isDeveloper(user) {
		return dev.includes(user.id)
	}

	static get developerOverrides() {
		return Settings.doesDeveloperOverride();
	}

	static isOwner(user, guild) {
		return user.id == guild.ownerID
	}

	static async isModerator(member, guild) {
		let moderatorRole = await Settings.getValue(guild, "moderatorRole")
		const role = guild.roles.get(moderatorRole)
		if (!moderatorRole || !guild.roles.has(moderatorRole) || !role) return false;
		return member.roles.highest.comparePositionTo(role) >= 0;
	}

	static async isAdministrator(member, guild) {
		let adminRole = await Settings.getValue(guild, "adminRole")
		const role = guild.roles.get(adminRole)
		if (!adminRole || !guild.roles.has(adminRole) || !role) return false;
		return member.roles.highest.comparePositionTo(role) >= 0;
	}

	static async grabPermissionLevel(user, guild, permission) {
		let moderatorRole = await Settings.getValue(guild, "moderatorRole")
		let adminRole = await Settings.getValue(guild, "adminRole")
		let roles = { moderator: { role: moderatorRole, exists: guild.roles.has(moderatorRole)}, 
					admin: { role: adminRole, exists: guild.roles.has(adminRole) }}

		if (user.developer) return 4;
		if (Permissions.isOwner(user, guild)) return 3;

		const member = await guild.members.fetch(user.id);
		if (!roles.admin.exists ? member.hasPermission(permission, true, true) : 
		await Permissions.isModerator(member, guild)) return 2;
		if (!roles.moderator.exists ? member.hasPermission(permission, true, true) : await Permissions.isAdministrator(member, guild)) return 1;
		
		return 0;
	}
}

module.exports = Permissions;
