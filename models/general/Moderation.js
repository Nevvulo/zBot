const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');

const Moderation = Database.db.define('punishments', {
	case: Sequelize.INTEGER,
	guildID: Sequelize.STRING,
	userID: Sequelize.STRING,
	time: Sequelize.STRING,
	type: Sequelize.STRING,
	punishedBy: Sequelize.STRING,
	reason: Sequelize.STRING,
	duration: Sequelize.STRING,
	punishedByName: Sequelize.STRING,
	message: Sequelize.JSON
});

module.exports = Moderation;
