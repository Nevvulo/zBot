const User = require('./../../models/User.js');
var totalXP = 0;

class Experience {

	static async getTotalExperience(userID, guild) {
		const userProfile = await User.findOne({ where: { userID: userID, guildID: guild } });
		totalXP = userProfile.experience;
		return userProfile.experience;
	}

	static async getCurrentExperience(userID, guildID) {
		const level = await Experience.getLevel(userID, guildID);
		const {
			lowerBound
		} = Experience.getLevelBounds(level);
		return totalXP - lowerBound;
	}

	static getLevelBounds(level) {
		const upperBound = Math.ceil((level / 0.177) ** 2);
		const lowerBound = Math.ceil(((level - 1) / 0.177) ** 2);

		return {
			upperBound,
			lowerBound
		};
	}

	static async getLevel(userID, guildID) {
		const exp = await Experience.getTotalExperience(userID, guildID);
		return Math.floor(0.177 * Math.sqrt(exp)) + 1;
	}

	static removeMember(userID, guildID) {
		sql.get(`SELECT * FROM experience WHERE userId ='${userID}' AND guild = '${guildID}'`).then(row => {
			sql.get(`DELETE FROM experience WHERE userId = '${userID}' AND guild = '${guildID}'`).then(row => {
				log("Member removed from guild", logType.info)
			});
		});
	}
}

module.exports = Experience;
