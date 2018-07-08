const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');
const Guild = Database.db.define('guild', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	autoroles: {
		type: Sequelize.JSON,
		defaultValue: {
			roles: [] //{role: {id: STRING, name: STRING }, level: INTEGER, removeOnLevelChange: BOOLEAN, onJoin: BOOLEAN }
		}
	},
	disable: {
		type: Sequelize.JSON,
		defaultValue: {
			commands: [] //{command: STRING, channelID: STRING, guildID: STRING}
		}
	},
	filter: {
		type: Sequelize.JSON,
		defaultValue: {
			words: [], //just an array of STRINGS
			level: 0
		}
	},
	logs: {
		type: Sequelize.JSON,
		defaultValue: {
			message: {},
			member: {},
			moderation: {},
			other: {}
		}
	},
	ignore: {
		type: Sequelize.JSON,
		defaultValue: {
			modules: [] //{module: STRING, channelID: STRING, guildID: STRING}
		}
	},
	autoresponses: {
		type: Sequelize.JSON,
		defaultValue: {
			responses: [] //{trigger: STRING, response: STRING}
		}
	}
});

module.exports = Guild;
