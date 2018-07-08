const Sequelize = require('sequelize');
const { CurrencySettings } = require('./../../util/Constants.js');
const Database = require('./../../structures/PostgreSQL.js');
const User = Database.db.define('user', {
	userID: Sequelize.STRING,
	username: Sequelize.STRING,
	discriminator: Sequelize.STRING,
	guildID: Sequelize.STRING,
	experience: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: 0
	},
	balance: {
		type: Sequelize.BIGINT(), // eslint-disable-line new-cap
		defaultValue: CurrencySettings.startingBalance,
		allowNull: false
	},
	background: {
		type: Sequelize.STRING,
		defaultValue: "default"
	},
  role: {
		type: Sequelize.JSON,
		defaultValue: {
			name: "@everyone",
			color: "000000"
		}
	},
	weapon: {
		type: Sequelize.STRING,
		defaultValue: "wooden"
	},
	afk: {
		type: Sequelize.JSON,
		defaultValue: {
			afk: false,
			reason: null
		}
	},
	inventory: {
		type: Sequelize.JSON,
		defaultValue: {
			slots: [],
			badges: [], //whatever is in this array doesn't matter, in the badges structure we will check if any of the values match one of the badges made in the structure
				//be something like {name: "badge", stats: 0, level: 0}
			items: [] //this is just a string of an item (like "oceansunset" or "html")
		}
	},
	daily: {
		type: Sequelize.JSON,
		defaultValue: {
			streak: 0,
			received: null
		}
	},
	donator: {
		type: Sequelize.JSON,
		defaultValue: {
			patron: false,
			redeemed: false
		}
	},
	work: {
		type: Sequelize.JSON,
		defaultValue: {
			hoursWorked: 0.5,
			salary: 11,
			lastWorked: null
		}
	}
});

module.exports = User;
