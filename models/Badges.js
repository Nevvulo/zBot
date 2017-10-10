const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL.js');

const Badges = Database.db.define('badges', {
	userID: Sequelize.STRING,
	guildID: Sequelize.STRING,
	developer: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	moderator: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	essaywriter: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	friendship: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	photographer: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	}
});

module.exports = Badges;
