const User = require('./../../models/user/User.js');

class Economy {
	constructor () {

	}

	async balance(member) {
		const profile = await member.profile;
		const eco = profile.get("balance");
		return Math.floor(eco || 0);
	}

	async add(member, amount) {
		amount = Number(amount);
		if (amount < 0 || isNaN(amount)) throw new TypeError("Invalid amount");
		const eco = (await member.profile).get("balance");
		const updated = Math.floor(Number(eco)+amount);
		await member.update("balance", updated)
		return updated;
	}

	async remove(member, amount) {
		amount = Number(amount);
		if (amount < 0 || isNaN(amount)) throw new TypeError("Invalid amount");
		const eco = (await member.profile).get("balance");
		const updated = Math.floor(Number(eco)-amount);
		await member.update("balance", updated)
		return updated;
	}

	async set(member, amount) {
		amount = Number(amount);
		if (amount < 0 || isNaN(amount)) throw new TypeError("Invalid amount");
		const eco = (await member.profile).get("balance");
		const updated = Math.floor(Number(amount));
		await member.update("balance", updated)
		return updated;
	}

	async daily(member, type) {
		const daily = (await member.profile).get("daily");
		if (!daily) await member.update("daily", {streak: 1, received: Date.now()})
		if (!this.dailyBonus[type]) type = "user";

		const now = Date.now();
		const last = daily.received;
		const diff = now - last;
		const next = 172800000 - diff;

		const increment = diff >= 172800000 ? 0 : daily.streak
		await member.update("daily", {streak: increment+1, received: Date.now()})
		const updated = Math.floor(Number(this.dailyAmount+this.dailyBonus[type]+(this.dailyIncrementAmount*increment)))
		this.add(member, updated)
		return updated;
	}

	async work(member, type) {
		let work = (await member.profile).get("work");
		if (!work) {
			await member.update("work", {lastWorked: Date.now(), hoursWorked: 0.5, salary: 11})
			work = (await member.profile).get("work");
		}
		if (work.salary < 2) {
			await member.update("work", {lastWorked: Date.now(), hoursWorked: 0.5, salary: 11})
			work = (await member.profile).get("work");
		}

		const formula = Math.floor(work.salary+Math.floor(work.hoursWorked)+(Math.floor(Math.random()*10)))
		await member.update("work", {lastWorked: Date.now(), hoursWorked: work.hoursWorked+0.5, salary: work.salary})
		this.add(member, formula+this.dailyBonus[type])
		return {earned: formula, hours: work.hoursWorked+0.5};
	}

	async patron(member, level) {
		const amount = member.user.patron.amount*1000;
		this.add(member, amount)
		const d = (await member.profile).get("donator")
		d.redeemed = true;
		await member.update("donator", d)
		return amount;
	}

	get dailyAmount() {
		return 100;
	}

	get dailyIncrementAmount() {
		return 25;
	}

	get dailyBonus() {
		return {
			user: 0,
			upvoter: 20,
			plus: 75,
			ultra: 200,
			contributor: 5,
			developer: 10,
		}
	}

	get workBonus() {
		return {
			user: 0,
			upvoter: 5,
			plus: 25,
			ultra: 100,
			contributor: 5,
			developer: 10,
		}
	}
}

module.exports = Economy;
