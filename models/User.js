const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL.js');
const User = Database.db.define('user', {
	userID: Sequelize.STRING,
	guildID: Sequelize.STRING,
	experience: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	g_experience: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	background: {
		type: Sequelize.STRING,
		defaultValue: 'default'
	},
  role: {
		type: Sequelize.STRING,
		defaultValue: 'default'
	},
	roleColor: {
		type: Sequelize.STRING,
		defaultValue: '000000'
	},
	weapon: {
		type: Sequelize.STRING,
		defaultValue: 'wooden'
	}
});

module.exports = User;
