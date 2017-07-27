const fs = require('fs');
var talkedRecently = [];

exports.run = (client, message, args) => {
	console.log(args)
message.guild.fetchMember(args[2]).then(function(member) {

let badgesA = JSON.parse(fs.readFileSync('./data/badges/Badge Tracker.json', 'utf8'));
let badgesP = JSON.parse(fs.readFileSync('./data/profile/profile-background.json', 'utf8'));
var badges = JSON.parse(fs.readFileSync('./slots.json', 'utf8'));
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));

if (!badgesC[member.id])
			badgesC[member.id] = {
				weapon: "none"
			};

// if the user has no badges, init to false.
if (!badges[member.id])
	badges[member.id] = {
		slot1: "empty",
		slot2: "empty",
		slot3: "empty",
		slot4: "empty",
		slot5: "empty",
		slot6: "empty"
	};

// if the user has no badges, init to false.
if (!badgesP[member.id])
	badgesP[member.id] = {
		background: "default"
	};

var userSlots = badges[member.id];
var userBadges = badgesA[member.id];
var userProfile = badgesP[member.id];
var userChallenge = badgesC[member.id];

message.delete();


// Checks if they have talked recently
if (talkedRecently.includes(member.id)) {
	return;
} else {

if (args == "list") {
let tosend = []
for (var key in userBadges) {
    var value = userBadges[key];

    if (value > 0) {
	tosend.push(key)
	}
}

message.reply(":white_check_mark: **OK:** These are the badges that you currently own: **" + tosend + "**.");
return;
}

var num = args[0];
var badge = args[1].toString();

		if (num == 1 || num == 2 || num == 3 || num == 4 || num == 5 || num == 6) {
		if (eval(`userBadges.${badge} == 1`) == true) {
 		eval(`userSlots.slot${num} = "${badge}"`);
		} else {
		return;
		}
		}

		if (num == "background") {
		eval(`userProfile.background = "${badge}"`);
		fs.writeFile('./data/profile/profile-background.json', JSON.stringify(badgesP, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
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

	// Adds the user to the array so that they can't talk for 65 seconds
	talkedRecently.push(member.id);
	client.setTimeout(() => {
		const index = talkedRecently.indexOf(member.id);
		// Removes the user from the array after 65 seconds
		talkedRecently.splice(index, 1);
	}, 65000);
}
})
}
