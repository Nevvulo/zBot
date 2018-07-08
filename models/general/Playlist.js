const Sequelize = require('sequelize');

const Database = require('./../../structures/PostgreSQL.js');

const Playlist = Database.db.define('playlists', {
  userID: Sequelize.STRING,
  guildID: Sequelize.STRING,
  playlistID: Sequelize.STRING,
  playlistName: Sequelize.STRING,
  playlistAvatar: Sequelize.STRING,
  playlistDescription: Sequelize.STRING,
  playlistPrivacy: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  songs: Sequelize.JSON,
  stars: Sequelize.JSON,
  views: Sequelize.JSON,
});

module.exports = Playlist;
