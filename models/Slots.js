const Sequelize = require('sequelize');

const Database = require('../structures/PostgreSQL.js');

const Slots = Database.db.define('slots', {
	userID: Sequelize.STRING,
	guildID: Sequelize.STRING,
	slot1: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	},
	slot2: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	},
	slot3: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	},
	slot4: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	},
	slot5: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	},
	slot6: {
		type: Sequelize.STRING,
		defaultValue: "empty"
	}
});

module.exports = Slots;
