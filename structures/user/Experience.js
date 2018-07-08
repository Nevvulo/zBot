class Experience {
	static async getTotalExperience(member) {
		const userProfile = (await member.profile)
		if (!userProfile) return 0;
		return userProfile.get("experience") || 0;
	}

	static async getCurrentExperience(member) {
		const level = await Experience.getLevel(member);
		let totalXP = await Experience.getTotalExperience(member)
		const { lowerBound } = Experience.getLevelBounds(level);
		return totalXP - lowerBound;
	}

	static getLevelBounds(level) {
		const upperBound = Math.ceil((level / 0.177) ** 2);
		const lowerBound = Math.ceil(((level - 1) / 0.177) ** 2);

		return { upperBound, lowerBound };
	}

	static async getLevel(member) {
		const exp = await Experience.getTotalExperience(member)
		return Math.floor(0.177 * Math.sqrt(exp)) + 1;
	}

	static getLevelFromExp(exp) {
		return Math.floor(0.177 * Math.sqrt(exp)) + 1;
	}
}

module.exports = Experience;
