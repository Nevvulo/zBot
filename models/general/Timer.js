const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');

const Timer = Database.db.define('timer', {
	timerID: Sequelize.STRING,
	userID: Sequelize.STRING,
  guildID: Sequelize.STRING,
  reason: {
		type: Sequelize.STRING,
		defaultValue: ""
	},
  timerEnd: Sequelize.STRING,
	timeSpecified: Sequelize.STRING
});

module.exports = Timer;
