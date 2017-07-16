const fs = require('fs');
//Database require
const sql = require('sqlite');
sql.open('./score.sqlite');

exports.run = (client, message, args) => {
let badgesP = JSON.parse(fs.readFileSync('./data/profile/profile-background.json', 'utf8'));
var badges = JSON.parse(fs.readFileSync('./slots.json', 'utf8'));
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));

if (!badgesC[message.author.id])
			badgesC[message.author.id] = {
				weapon: "none"
			};
// if the user has no badges, init to false.
if (!badges[message.author.id])
	badges[message.author.id] = {
		slot1: "empty",
		slot2: "empty",
		slot3: "empty",
		slot4: "empty",
		slot5: "empty",
		slot6: "empty"
	};

// if the user has no badges, init to false.
if (!badgesP[message.author.id])
	badgesP[message.author.id] = {
		background: "default"
	};


var userProfile = badgesP[message.author.id];
var userChallenge = badgesC[message.author.id];
var userSlots = badges[message.author.id];

message.delete();

if (args == "list") {
let tosend = []
sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}'`).then(rows => {
	tosend.push(rows)
})

message.reply(":white_check_mark: **OK:** These are the badges that you currently own: **" + tosend + "**.");
return;
}

var num = args[0];
var badge = args[1].toString();

		sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}'`).then(row => {
		if (num == 1 || num == 2 || num == 3 || num == 4 || num == 5 || num == 6) {
		if (eval(`row.${badge}`) == 1 || badge == "empty") {
 		eval(`userSlots.slot${num} = "${badge}"`);
		message.reply(":white_check_mark: **OK:** You've successfully equipped the badge **" + badge + "** into slot **" + num + "**.");
		fs.writeFile('./slots.json', JSON.stringify(badges, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
		} else {
		message.reply(":no_entry_sign: **NOPE:** You can't equip this badge because you don't own it or it doesn't exist.");
		return;
		}
		}
	})

		if (num == "background") {
		eval(`userProfile.background = "${badge}"`);
		fs.writeFile('./data/profile/profile-background.json', JSON.stringify(badgesP, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
			message.reply(":white_check_mark: **OK:** You've successfully equipped the background **" + badge + "**.");
		return;
		//message.reply(":no_entry_sign: **NOPE:** You can't equip this background because you don't own it or it doesn't exist.");
		}

		if (num == "weapon") {
		// all possible weapons:
		// wooden, stone, iron, diamond, master
		// sub sword: gold, gold sword will stun user with special ability
		eval(`userChallenge.weapon = "${badge}"`);
		fs.writeFile('./data/challenge/equipment.json', JSON.stringify(badgesC, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
			message.reply(":white_check_mark: **OK:** You've successfully equipped the weapon **" + badge + "**. This can be used in challenges.");
		return;
		//message.reply(":no_entry_sign: **NOPE:** You can't equip this background because you don't own it or it doesn't exist.");
		}


		if (num == "all") {
			if (badge == "empty") {
			userSlots.slot1 = "empty";
			userSlots.slot2 = "empty";
			userSlots.slot3 = "empty";
			userSlots.slot4 = "empty";
			userSlots.slot5 = "empty";
			userSlots.slot6 = "empty";
			userProfile.background = "default";
			message.reply(":white_check_mark: **OK:** You've successfully unequipped **all** of your items.");
			} else {
			eval(`userSlots.slot1 = "${badge}"`);
			eval(`userSlots.slot2 = "${badge}"`);
			eval(`userSlots.slot3 = "${badge}"`);
			eval(`userSlots.slot4 = "${badge}"`);
			eval(`userSlots.slot5 = "${badge}"`);
			eval(`userSlots.slot6 = "${badge}"`);
			message.reply(`:white_check_mark: **OK:** You've successfully equipped the badge **${badge}** in to *all* of your slots.`);
			}
		}

		fs.writeFile('./slots.json', JSON.stringify(badges, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
}
