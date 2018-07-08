const Sequelize = require('sequelize');
const Database = require('./../../structures/PostgreSQL.js');
const SettingsModel = Database.db.define('settings', {
	guildID: Sequelize.STRING,
	prefix: {
		type: Sequelize.STRING,
		defaultValue: "+"
	},
	expletiveFilter: { //NO LONGER AVAILABLE TODO
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	spamFilter: { //NO LONGER AVAILABLE TODO
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	moderatorRole: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
	muteRole: {
		type: Sequelize.STRING,
		defaultValue: "null"
	},
	experienceTracking: { //NO LONGER AVAILABLE TODO
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
  	musicDisplayNowPlaying: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	experienceGainMax: { //NO LONGER AVAILABLE TODO: implement `gain` subcommand in `experience`
		type: Sequelize.STRING,
		defaultValue: "0"
	},
 	experienceGainMin: { //NO LONGER AVAILABLE TODO: implement `gain` subcommand in `experience`
		type: Sequelize.STRING,
		defaultValue: "0"
	},
	deleteUserCommand: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
	allowMentions: { //CHANGED
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	levelUpMessages: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	leaveMessage: { //NO LONGER AVAILABLE TODO: create `leave` command
		type: Sequelize.STRING,
		defaultValue: "Goodbye!"
	},
	joinMessage: { //NO LONGER AVAILABLE TODO: create `welcome` command
		type: Sequelize.STRING,
		defaultValue: "Hello!"
	},
	//new stuff starts here
	punishConfirmation: { //CHANGED
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
	dmPunishments: { //CHANGED
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	adminRole: { //CHANGED
		type: Sequelize.STRING,
		defaultValue: "null"
	},
	djRole: { //CHANGED
		type: Sequelize.STRING,
		defaultValue: "null"
	}
});

module.exports = SettingsModel;
