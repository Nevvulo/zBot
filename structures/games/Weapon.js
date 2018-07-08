const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const SettingsModel = require('./../../models/general/Settings.js')

var wood = {
	"name": "Wooden Sword",
	"description": "A wooden sword. It may not be great, but it's better than nothing.",
	"damage": 1,
	"type": "wood",
	"specialAbility": false,
	"requiredLevel": 0,
	"cost": 10000
};

var stone = {
	"name": "Stone Sword",
	"description": "The stone sword. It doesn't look strong, but catches even the best off guard.",
	"damage": 1.25,
	"type": "stone",
	"specialAbility": {
		"name": "Avalanche",
		"description": "Watch for rolling rocks. A single blow to the head with one of these boulders will deal anywhere from **10 - 24 damage!**"
	},
	"requiredLevel": 5,
	"cost": 25000
};

var steel = {
	"name": "Steel Sword",
	"description": "A steel sword is no joke. If you aren't careful, you'll become a smear of blood on the wall.",
	"damage": 1.75,
	"type": "steel",
	"specialAbility": {
		"name": "Cutting Edge",
		"description": "Slices your opponents badly, causing them to bleed. They will lose **5 HP** for every turn they have."
	},
	"requiredLevel": 10,
	"cost": 500000
};

var diamond = {
	"name": "Diamond Sword",
	"description": "This sharp, diamond edged sword will slice and dice you into pieces.",
	"damage": 2.5,
	"type": "diamond",
	"specialAbility": {
		"name": "Blizzard",
		"description": "Stuns your opponent for 1 turn and grants you with **15 HP**!"
	},
	"requiredLevel": 25,
	"cost": 1000000
};

var platinum = {
	"name": "Platinum Sword",
	"description": "This weapon has gigantic amounts of power and damage that just wielding it is a great responsibility.",
	"damage": 3,
	"type": "platinum",
	"specialAbility": {
		"name": "May god have mercy",
		"description": "Only god can save you at this point."
	},
	"requiredLevel": 50,
	"cost": 100000000
};

class Weapon {
	static giveEquippableWeapons(level) {
		var weapons = ["wood", "stone", "steel", "diamond", "platinum"]
		var canEquip = [];
		for (var i in weapons) {
			var weapon = Weapon.grabWeapon(weapons[i])
			if (level > weapon.requiredLevel) canEquip.push(weapon.type)
		}
		return canEquip;
	}

	static canSpecial(weapon) {
		var weaponGrabbed = Weapon.grabWeapon(weapon)
		if (weaponGrabbed == undefined) weaponGrabbed = wood;
		if (weaponGrabbed.specialAbility !== undefined) {
			return true;
		} else {
			return false;
		}
	}

	static async add(member, weapon) {
		if (!weapon.type) weapon = this.grabWeapon(weapon);
		const Inventory = new(require("./../../structures/user/Inventory.js"))(this.member)
		await Inventory.add(Object.assign({id: weapon.type, name: weapon.name, 
			description: weapon.description}, { type: "weapon", cost: weapon.cost || null }))
	}

	static async remove(member, weapon) {
		if (!weapon.type) weapon = this.grabWeapon(weapon);
		const Inventory = new(require("./../../structures/user/Inventory.js"))(this.member)
		await Inventory.remove(Object.assign({id: weapon.type, name: weapon.name, 
			description: weapon.description}, { type: "weapon", cost: weapon.cost || null }))
	}

	static grabWeapon(weapon) {
		if (weapon == "wooden" || weapon == "wood") return wood;
		if (weapon == "stone") return stone;
		if (weapon == "steel" || weapon == "iron") return steel;
		if (weapon == "diamond") return diamond;
		if (weapon == "platinum") return platinum;
		return null;
	}
}

module.exports = Weapon;
