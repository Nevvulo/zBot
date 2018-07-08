exports.settings = {command: "league", description: "Gives information about a specific League of Legends user.", usage: "league (region) (username)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const snekfetch = require("snekfetch")
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	let region = (args[0] == undefined ? "" : args[0].toString())
	const name = args.slice(1).join(" ")
	const apidir = new (require("./../../data/main/keys/keys.js"))
	const api = apidir.lol
	const prefix = await Settings.getValue(message.guild, "prefix")
	const regionArray = []
	const regions = {
		"BR": "BR1",
		"EUNE": "EUN1",
		"EUW": "EUW1",
		"JP": "JP1",
		"KR": "KR",
		"LAN": "LA1",
		"LAS": "LA2",
		"NA": "NA1",
		"OCE": "OC1",
		"TR": "TR1",
		"RU": "RU"
	}

	for (const key in regions) {
		region = region.replace(new RegExp(key, "ig"), regions[key])
		regionArray.push(regions[key])
	}
	const regionsList = Object.keys(regions).join("` `")
	if (regionArray.indexOf(region) == -1) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid region. Here is a list of all of the valid regions you can pick from;\n\`${regionsList}\``)
	if (region == "" || region == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a region to search in. For more information, type \`${prefix}help league\`.`)
	if (name == "" || name == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to search for. For more information, type \`${prefix}help league\`.`)

	snekfetch.get(`https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?api_key=${api}`)
		.set("Accept", "application/json")
		.then(res => {
			const info = JSON.parse(res.text)
			if (info.id == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a summoner called ${name}. Try again with a different region, or check your spelling.`)
			const image = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${info.profileIconId}.png`
			const summonerId = info.id
			snekfetch.get(`https://${region}.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId}?api_key=${api}`)
				.set("Accept", "application/json;charset=utf-8")
				.then(leagueres => {
					if (!leagueres.text) return message.zreply(`${client.util.emoji("nope", message.guild)} There was an error whilst collecting information on this summoner. If this summoner hasn't played league in a while, I might not be able to grab their statistics.`);
					let leagueinfo = JSON.parse(leagueres.text)
					console.log(leagueinfo)
					leagueinfo = leagueinfo[0]
					const notPlayedSeason = leagueinfo
					const embed = new Discord.MessageEmbed()
					embed.setAuthor(`League of Legends ● ${region}`)
					embed.addField("Name", info.name, true)
					embed.addField("Level", `${info.summonerLevel} - ${!notPlayedSeason ? "UNRANKED" : `${leagueinfo.tier} ${leagueinfo.rank}`}`, true)
					if (!notPlayedSeason) { embed.addField("Wins / Losses", `${leagueinfo.wins} / ${leagueinfo.losses}`, true); embed.addField("League Points", leagueinfo.leaguePoints, true) }
					embed.setThumbnail(image)
					embed.setColor("#9b59b6")
					embed.setFooter(`Summoner ID - ${summonerId}`)
					message.channel.zend({ embed })

				})
		}).catch(function(e) {
			console.log(e)
			return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a summoner called ${name}. Try again with a different region, or check your spelling.`)
		})
}
