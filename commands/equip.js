const fs = require('fs');
//Database require
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite');

exports.run = (client, message, args) => {
let badgesP = JSON.parse(fs.readFileSync('./data/profile/profile-background.json', 'utf8'));
var badgesC = JSON.parse(fs.readFileSync('./data/challenge/equipment.json', 'utf8'));

if (!badgesC[message.author.id])
			badgesC[message.author.id] = {
				weapon: "none"
			};

// if the user has no badges, init to false.
if (!badgesP[message.author.id])
	badgesP[message.author.id] = {
		background: "default"
	};


var userProfile = badgesP[message.author.id];
var userChallenge = badgesC[message.author.id];

message.delete();

if (args[0] == "list") {
if (args[1] == "badges") {
let tosend = []
sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}'`).then(rows => {
	let tempRows = JSON.stringify(rows, null, 2)
	let jRows = JSON.parse(tempRows)
	for (var key in jRows) {
	     var value = jRows[key];
			 if (value > 0 && key !== "userId" && key !== "guild") {
			tosend.push(" " + key)
			}
	  }
		message.reply(":white_check_mark: **OK:** These are the badges that you currently own:**" + tosend + "**.");
		return;
})
} else {
	var testFolder = './assets/profile/backgrounds';
	var backgrounds = [];
	fs.readdir(testFolder, (err, files) => {
	  files.forEach(file => {
			file = file.replace(".png", "")
	    backgrounds.push(" " + file);
	  });
		message.reply(":white_check_mark: **OK:** Here are all of the backgrounds that you can equip:**" + backgrounds + "**.");
	})
}
}

var num = args[0];
var badge = args[1]
sql.get(`SELECT * FROM slots WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(rows => {
		sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(row => {
		if (num == 1 || num == 2 || num == 3 || num == 4 || num == 5 || num == 6) {
		if (eval(`row.${badge}`) == 1 || badge == "empty") {
 		sql.run(`UPDATE slots SET slot${num} = "${badge}" WHERE userId = ${message.author.id} AND guild = ${message.guild.id}`);
		message.reply(":white_check_mark: **OK:** You've successfully equipped the badge **" + badge + "** into slot **" + num + "**.");
		} else {
		message.reply(":no_entry_sign: **NOPE:** You can't equip this badge because you don't own it or it doesn't exist.");
		return;
		}
		}
	})
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
		eval(`userChallenge.weapon = "${badge}"`);
		fs.writeFile('./data/challenge/equipment.json', JSON.stringify(badgesC, null, 2), function(err) {
				if (err) {
					console.error(err)
				}
			});
			message.reply(":white_check_mark: **OK:** You've successfully equipped a **" + badge + "** sword. This can be used in challenges.");
		return;
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

}

let command = 'equip'
, description = 'Allows you to equip specific items to your profile.'
, usage = 'equip **[slot]** **[item name]**'
, example = 'equip **background** **polymountains**'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, example: example}
