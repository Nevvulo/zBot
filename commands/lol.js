const snekfetch = require("snekfetch");
const Discord = require('discord.js');

exports.run = (client, message, args) => {
	const region = args[0];
	const name = args.slice(1).join(' ');
	const api = "RGAPI-d58dc220-510b-412f-a503-86adebd9ae59"
	message.delete();
    snekfetch.get(`https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?api_key=${api}`)
		.set('Accept', "application/json")
		.then(res => {
			const info = JSON.parse(res.text)
			if (info.id == undefined) return message.reply(":no_entry_sign: **ERROR**: I couldn't find a summoner with that name. Try again with a different region, or check your spelling.")
			const image = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/" + info.profileIconId + ".png";
			let summonerId = info.id
			snekfetch.get(`https://${region}.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${api}`)
			.set('Accept', "application/json;charset=utf-8")
			.then(leagueres => {
			var leagueinfo = JSON.parse(leagueres.text)
			leagueinfo = leagueinfo[0]
			if (leagueinfo == undefined) {
				var notPlayedSeason = true;
			}
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('League of Legends')
			embed.addField("Name", info.name, true)
			embed.addField("Level", info.summonerLevel + " - " + (notPlayedSeason ? "UNRANKED" : leagueinfo.tier + " " + leagueinfo.rank), true)
			if (!notPlayedSeason) { embed.addField("Wins / Losses", leagueinfo.wins + " / " + leagueinfo.losses, true); embed.addField("League Points", leagueinfo.leaguePoints, true) }
			embed.setThumbnail(image)
			embed.setColor("#b3cc39")
			embed.setFooter("Summoner ID - " + summonerId)
			message.channel.send({ embed })

		});
}).catch(function(error) {
	return message.reply(":no_entry_sign: **ERROR**: I couldn't find a summoner with that name. Try again with a different region, or check your spelling.")
});
}

let command = 'lol'
, description = 'Gives information about a specific League of Legends user.'
, usage = 'lol (region) (username)'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
