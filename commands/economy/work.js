exports.settings = {command: "work", description: "Quick way to earn money, work 8 hours and receive your salary!", usage: "work", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	let info = (await message.member.profile).get("work");
	
	const now = Date.now();
	const last = info.lastWorked || 0;
	const diff = now - last;
	const next = 1800000 - diff;

	const hours = Math.floor(next / 3600000);
	const minutes = Math.floor((next / 60000) - (hours * 60));
	const seconds = Math.floor((next / 1000) - ((hours * 3600) + (minutes * 60)));

	const timeArr = [{ type: {singular: "hour", plural: "hours"}, amount: hours },
									 { type: {singular: "minute", plural: "minutes"}, amount: minutes },
									 { type: {singular: "second", plural: "seconds"}, amount: seconds } ];
 	let properArr = [];

 	for (let i in timeArr) {
 		if (timeArr[i].amount < 1) continue;
 		properArr.push(`${timeArr[i].amount} ${timeArr[i].amount == 1 ? timeArr[i].type.singular : timeArr[i].type.plural}`)
 	}
 	let timeLeft = properArr.slice(0, -2).join(', ') + (properArr.slice(0, -2).length ? ', ' : '') + properArr.slice(-2).join(' and ');
	const funkyQuotes = [
		"What a long day!",
		"What a hard worker you are!",
		"Nothing like cracking a cold one open with the boys!",
		"Just another day in the office!",
		"Good work there!",
		"Working hard or hardly working?",
		"Time to get off the feet!",
		"Time to relax!",
		"Hard day!",
		"Money, money, money!",
		"Nothing can stop you now!",
		"Don't stop me now!",
		"No worries!",
		"Not a hassle!",
		"No stress at all!",
		"Flying through work like nothing!",
		"Too easy!",
		"I'm having such a good time!",
		"I'm having a ball!",
		"If only it were this easy in real life!",
		"No struggles here!"
	]
	
  if (diff >= 1800000) {
	  	let type = "user";
		  const types = {
			  "plus": message.author.patron.level == 1,
			  "ultra": message.author.patron.level == 2,
			  "developer": message.author.developer,
			  "contributor": Object.keys(client.contributors).includes(message.author.id),
			  "upvoter": message.author.upvoted,
			  "user": true
		  }
  
		  for (let [key, value] of Object.entries(types)) {
			  if (value) {
				  type = key; 
				  break;
			  }
		  }
		const work = await Economy.work(message.member, type)
		return message.zreply(`${client.util.emoji("ok", message.guild)} ${funkyQuotes[Math.floor(Math.random()*
			funkyQuotes.length)]} You work long and hard to receive \`${Constants.CurrencySettings.symbol}${work.earned}\`. You have now worked a total of \`${work.hours}\` hours.`)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} You need to wait \`${timeLeft}\` before you can work again.`)
	}
}
