const sql = require('sqlite');
sql.open('./score.sqlite');
var totalXP = 0;

class Experience {
	static async getTotalExperience(userID) {
		await sql.get(`SELECT * FROM scores WHERE userId ='${userID}'`).then(row => {
		totalXP = row.experience;
		console.log("total = " + totalXP);
		return totalXP;
		})
	}

	static async getCurrentExperience(userID) {
		const level = await Experience.getLevel(userID);
		
		const { lowerBound } = Experience.getLevelBounds(level);
		console.log("current = " + eval(totalXP - lowerBound));
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

	static async getLevel(userID) {
		return Math.floor(0.177 * Math.sqrt(totalXP)) + 1;
	}
}

module.exports = Experience;