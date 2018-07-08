const User = require("./../../models/user/User.js")
const Constants = require("./../../util/Constants.js")
const Weapon = require("./../games/Weapon.js")
const Experience = require("./Experience.js")

class Inventory {
	constructor(member) {
		this.member = member;
	}

	async check() {
		let user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (!inventory.items) await this.member.fix; 
	}

	async exists(item) {
		for (let [key, value] of Object.values(Constants.Items)) {
			for (let i of key) {
				if (item.id == key[i].id) return true;
			}
		}
		return false;
	}

	async has(item) {
		let user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (!inventory.items) {
			await this.member.fix; 
			user = (await this.member.profile); 
			inventory = user.get("inventory");
		} 
		let items = inventory.items;
		for (let i in items) {
			if (items[i].id === item.id) {
				return true;
			}
		}
		return false;
	}

	get all() {
		return (async () => {
			let user = (await this.member.profile);
			let inventory = user.get("inventory");
			if (!inventory.items) {
				await this.member.fix; 
				user = (await this.member.profile); 
				inventory = user.get("inventory");
			} 
			let items = [];
			let update = false;
			for (let i in inventory.items) {
				if (inventory.items[i].dataValues) {
					update = true;
					inventory.items[i] = inventory.items[i].dataValues;
				}
				items.push(inventory.items[i])
			}
			if (update) await this.member.update("inventory", items);
			return items
		})();
	}

	async add(item) {
		if (await this.has(item)) return;
		let user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (!inventory.items) {
			await this.member.fix; 
			user = (await this.member.profile); 
			inventory = user.get("inventory");
		} 
		if (item.constructor === Array) {
			for (let i in item) {
				inventory.items.push(item[i]);
			}
		} else {
			inventory.items.push(item);
		}
		const changed = await this.member.update("inventory", inventory);
		return changed;
	}

	async remove(item) {
		if (await !this.has(item)) return;
		let user = (await this.member.profile);
		let inventory = user.get("inventory");
		if (!inventory.items) {
			await this.member.fix; 
			user = (await this.member.profile); 
			inventory = user.get("inventory");
		} 
		if (item.constructor === Array) {
			for (let i in item) {
				inventory.items = inventory.items.filter(o => o.id !== item[i].id);
			}
		} else {
			inventory.items = inventory.items.filter(o => o.id !== item.id);
		}
		const changed = await this.member.update("inventory", inventory);
		return changed;
	}
}

module.exports = Inventory;
