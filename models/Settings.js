const Sequelize = require('sequelize');
const Database = require('../structures/PostgreSQL.js');
const SettingsModel = Database.db.define('settings', {
	guildID: Sequelize.STRING,
	expletiveFilter: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	spamFilter: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
	moderatorRole: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
	muteRole: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
	prefix: {
		type: Sequelize.STRING,
		defaultValue: "+"
	},
	experienceTracking: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
  musicDisplayNowPlaying: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
  modLogsChannel: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
  memberLogsChannel: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
  joinMessageEnabled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
  joinMessage: {
		type: Sequelize.STRING,
		defaultValue: "Welcome!"
	},
  joinMessageChannel: {
		type: Sequelize.STRING,
		defaultValue: "null"
	}
});

module.exports = SettingsModel;
