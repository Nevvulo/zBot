const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');

const Tags = Database.db.define('tags', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  userID: Sequelize.STRING,
	guildID: Sequelize.STRING,
  usage_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
});

module.exports = Tags;
