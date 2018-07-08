const Tags = require('./../../models/general/Tags.js');
const User = require('./../../models/user/User.js');
const badges = {
developer: {
	"id": "developer",
	"name": "Developer",
	"levels": false,
	"description": "Be a developer of zBot."
},

moderator: {
	"id": "moderator",
	"name": "Moderator",
	"levels": false,
	"description": "Be a moderator on this guild.\nIf `moderatorRole` is not set in the configuration for this server, nobody will be able to obtain the moderator badge." //replace $1 with guild.name
},

friendship: {
	"id": "friendship",
	"name": "Friendship",
	"levels": {
		"1": "10",
		"2": "25",
		"3": "50",
	},
	"description": "Give a hug to someone through the `hug` command!"
},

//reach level 10
essaywriter: {
	"id": "essaywriter",
	"name": "Essay Writer",
	"levels": {
		"1": "10",
		"2": "25",
		"3": "50",
	},
	"description": "Reach level 10 within zBot."
},

//play and win 10 challenges
warrior: {
	"id": "warrior",
	"name": "Warrior",
	"levels": {
		"1": "10",
		"2": "50",
		"3": "100",
	},
	"description": "Play and win 10 challenges."
},

//play and win 5 challenges in a row
invictus: {
	"id": "invictus",
	"name": "Invictus",
	"levels": {
		"1": "5",
		"2": "10",
		"3": "15",
	},
	"description": "Play and win 5 challenges in a row."
},

//create 25 tags in total
tagger: {
	"id": "tagger",
	"name": "Tagger",
	"levels": {
		"1": "25",
		"2": "50",
		"3": "100",
	},
	"description": "Create 25 tags in total within zBot on this server."
},

//use 100 commands in total
commando: {
	"id": "commando",
	"name": "Commando",
	"levels": {
		"1": "500",
		"2": "1000",
		"3": "5000",
	},
	"description": "Use 500 commands within zBot in total on this server."
},

//use the translate command 50 times in total
multilingual: {
	"id": "multilingual",
	"name": "Multilingual",
	"levels": {
		"1": "50",
		"2": "100",
		"3": "250",
	},
	"description": "Translate 50 times in total within zBot using the `translate` command."
}
}

const InventoryStructure = require("./Inventory.js")

class Badges {
	constructor(user) {
		if (user) { 
			this.member = user.member || user;
		}
	}

	async has(badge) {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		let badges = inventory.badges;
		for (let i in badges) {
			if (badges[i].name === badge) {
				return true;
			}
		}
		return false;
	}

	get total() {
		return (async () => {
			const user = (await this.member.profile);
			let inventory = user.get("inventory");
			let badges = inventory.badges;
			return badges;
		})();
	}

	async progress(badge) {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		let badges = inventory.badges;
		for (let i in badges) {
			if (badges[i].name === badge) {
				return badges[i].stats;
			}
		}
	}

	async check() {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (inventory.badges.length > this.all.length) {
			inventory.badges = [];
			await this.member.update("inventory", inventory);
		}
		for (let i in this.all) {
			if (!Object.values(this.all[i].levels)[0]) {
				switch (this.all[i].id) {
					case "developer":
						if (this.member.user.developer) {
							this.add(this.all[i].id);
						} else {
							this.remove(this.all[i].id);
						}
						break;
					case "moderator":
						if (this.member.moderator) {
							this.add(this.all[i].id);
						} else {
							this.remove(this.all[i].id);
						}
						break;
				}
			}
			if (this.all[i].stats >= Number(Object.values(this.all[i].levels)[0]) && !this.has(this.all[i].id)) {
				this.incrementLevel(this.all[i].id);
			} else if (this.all[i].stats <= Number(Object.values(this.all[i].levels)[0]) && this.has(this.all[i].id)) {
				this.remove(this.all[i].id);
			}
		}
	}

	async incrementProgress(badge) {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		let badges = inventory.badges;
		for (let i in badges) {
			if (badges[i].name === badge) {
				badges[i].stats++;
			}
		}
		await this.member.update("inventory", inventory);
	}

	async incrementLevel(badge) {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		let badges = inventory.badges;
		for (let i in badges) {
			if (badges[i].name === badge) {
				badges[i].level++;
			}
		}
		await this.member.update("inventory", inventory);
	}

	async editProgress(badge, value) {
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		let badges = inventory.badges;
		for (let i in badges) {
			if (badges[i].name === badge) {
				badges[i].stats = value;
			}
		}
		await this.member.update("inventory", inventory);
	}

	async getLevel(badge) {
		// badge level starts off at 0 because user currently has no progress
		let badgeLevel = 0;
		let userProgress = await this.progress(badge)
		const badgeObj = this.get(badge);
		if (!badgeObj.levels) return "Badge doesn't contain any levels";
		Object.entries(badgeObj.levels).forEach(
			([key, value]) => {
			if (userProgress >= value) {
				badgeLevel = key;
			}
		})
		return Number(badgeLevel);
	}

	get(badge) {
		try {
			return badges[badge];
		} catch (err) {
			return "Invalid badge"
		}
	}

	get all() {
			let badgeArr = [];
			for (let i in badges) {
				badgeArr.push(badges[i])
			}
			return badgeArr;
	}

	async add(badge) {
		if (await this.has(badge)) return;
		badge = this.get(badge);
		const Inventory = new InventoryStructure(this.member)
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (!inventory) this.member.fix;
		inventory.badges.push({name: badge.id, stats: 0, level: 0});
		await Inventory.add({id: badge.id, name: badge.name, cost: null, 
			description: badge.description, type: "badge"});
			//It's important to note that items are completely separate from badges, and that
			//I'm only adding badges to the user's inventory because it makes equipping them
			//a lot easier. Badges are still badges, but they can also be generally found in
			// the user's inventory.
		await this.member.update("inventory", inventory)
	}

	async remove(badge) {
		badge = this.get(badge);
		const Inventory = new InventoryStructure(this.member);
		const user = (await this.member.profile);
		let inventory = user.get("inventory");
		inventory.badges = inventory.badges.filter(item => item !== badge.id);
		await Inventory.remove({id: badge.id, name: badge.name, cost: null, 
			description: badge.description, type: "badge"}) 
		await this.member.update("inventory", inventory)
	}
}

module.exports = Badges;
