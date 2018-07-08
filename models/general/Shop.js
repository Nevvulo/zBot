const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');

const Shop = Database.db.define('shop', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	name: {
      type: Sequelize.STRING,
      unique: true,
  },
  cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
			default: 0
  },
	description: Sequelize.STRING,
	type: Sequelize.STRING
}, {
  timestamps: false,
});

module.exports = Shop;
