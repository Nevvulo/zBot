exports.settings = {
    command: "blackjack",
    description: "Allows you to bet money to either lose or earn more.",
    usage: "blackjack [amount of money]",
    info: "To win Blackjack, you need to score higher than your opponent, but score lower than 21. If you score above 21, you lose. \
If your opponent scores higher than you, you lose.",
    aliases: ["bj"],
    throttle: { usages: 4, duration: 10 }
}

exports.run = async (client, message, args) => {
    let bonuses = [];
    let stood = false;
    let playing = false;

    const Discord = require("discord.js");
    const Economy = new(require("./../../structures/user/Economy.js"));
    const Constants = require("./../../util/Constants.js")
    const profile = (await message.member.profile)
    let bet = Math.floor(Number(args[0])) || 50
    let bonusBet = Math.floor(Number(args[1])) || 0

    if (!bet) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to bet a valid amount of ${Constants.CurrencySettings.name.plural}`)
    if (bet < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't bet a negative amount of ${Constants.CurrencySettings.name.plural}.`)
    if (profile.get("balance") < bet || profile.get("balance") < bonusBet) return message.zreply(`${client.util.emoji("nope", message.guild)} You don't have enough \
${Constants.CurrencySettings.name.plural} to bet this amount.`)

    if (playing) return message.zreply(`${client.util.emoji("nope", message.guild)} You're already playing a game of Blackjack.`)
    if (bonusBet) await Economy.remove(message.member, bonusBet)
    await Economy.remove(message.member, bet)
    playing = true;

    //function that returns a random card
    const deal = function() {
        card = Math.floor(Math.random() * 52 + 1);
        return card;
    };

    const cards = {
        bot: [deal(), deal()],
        user: [deal(), deal()]
    }

    //retrieving the value of the cards from the deal function
    const getValue = function(card) {
        if (card % 13 === 0 || card % 13 === 11 || card % 13 === 12) {
            return 10;
        }
        if (card % 13 === 1) {
            return 11;
        } else {
            return card % 13;
        }
    }

    function addCards(type) {
        let final = 0;
        for (let i in cards[type]) {
            final += getValue(cards[type][i])
        }
        return final;
    }

    function getCards(type) {
        let final = [];
        for (let i in cards[type]) {
            final.push(getValue(cards[type][i]))
        }
        return final;
    }

    function score() {
        if (addCards("user") > 21) { // User busted
            return { type: "l", emoji: "nope", message: "You lose! Busted!" }
        } else if (addCards("bot") > 21) { // Bot busted
            return { type: "w", emoji: "ok", message: "You win! Your opponent busted!" }
        } else if (addCards("user") == 21) { // User has exactly 21
            return { type: "w", emoji: "ok", message: "You win! You have 21!" }
        } else if (addCards("bot") == 21) { // Bot has exactly 21
            return { type: "l", emoji: "nope", message: "You lose! Your opponent reached 21 before you!" }
        } else if (addCards("bot") == addCards("user") && stood) { // Tie
            return { type: "t", emoji: "empty", message: "You tied with your opponent!" }
        } else if (addCards("user") <= 21 && cards.user.length == 5) { // User took more than 5 cards without going over 21
            return { type: "w", emoji: "ok", message: "You win! You took 5 cards without going over 21." }
        } else if (addCards("bot") <= 21 && cards.bot.length == 5) { // Bot took more than 5 cards without going over 21
            return { type: "l", emoji: "nope", message: "You lose! Your opponent took 5 cards without going above 21." }
		} else if (addCards("bot") > addCards("user") && stood) { 
			// If the bot has a score of 17 or more and the user has less than the bot, and the user is also stood
            return { type: "l", emoji: "nope", message: `You lose! You have ${addCards("user")}, Dealer has ${addCards("bot")}.` }
        } else if (addCards("user") > addCards("bot") && stood) { 
			// If the user has a higher score than the bot and they are 
            return { type: "w", emoji: "nope", message: `You win! You have ${addCards("user")}, Dealer has ${addCards("bot")}.` }
        } else {
            return addCards("user") //else
        }
    }

    function opposite(emoji) {
        if (emoji == "ok") return "nope";
        if (emoji == "nope") return "ok";
        return emoji;
    }

    function determineBonus(initial) {
        const added = addCards("user");
        const cards = getCards("user");
        const botCards = getCards("bot");

        if (added == 19 || added == 20 || added == 21) return "Lucky Lucky"
        if (added == 20 && initial) return "Lucky Ladies"
        if ((cards[0] == botCards[0] || cards[1] == botCards[1]) && initial) return "Match the Dealer"
        return null;
    }

    const gambed = async function(final) {
        const embed = new Discord.MessageEmbed()
        embed.setAuthor(`Blackjack » ${message.author.tag}`, message.author.displayAvatarURL())
        const status = score();
        if (status.constructor === Object) {
            let msg = "";
            switch (status.type) {
                case "l":
                    msg += `You lost \`${Constants.CurrencySettings.symbol}${bet}\`.`
                    break;
                case "t":
                    msg += `Your balance hasn't changed.`
                    await Economy.add(message.member, bet)
                    break;
                case "w":
                    msg += `You won \`${Constants.CurrencySettings.symbol}${bet*2}\`!`
                    await Economy.add(message.member, bet * 2)
                    break;
            }
            final = true;
            embed.setDescription(`**${status.message}** ${msg}`)
        }

        const bonus = bonusBet ? determineBonus(final) : false
        if (bonus && !bonuses.includes(bonus)) bonuses.push(bonus)

        embed.addField(`${message.author.username}`, `Cards - **\`${getCards("user").join("  ")}\`**\nTotal - \`${addCards("user")}\``, true)
        embed.addField(`${client.user.username}`, `Cards - **\`${final || stood ? getCards("bot").join("  ") : "?"}\`**\nTotal - \`${
			final || stood ? addCards("bot") : "? "}\``, true)
        embed.setColor("#ffa726")

        if (bonus && final) {
            await Economy.add(message.member, bonusBet * 2)
            embed.setFooter(`${bonuses.join(", ")} - Extra ${Constants.CurrencySettings.symbol}${bonusBet*(bonuses.length+1)}!`)
            bonuses = []
        }
		message.channel.zend(`${client.util.emoji("empty", message.guild)} **BLACKJACK**: What do you want to do?\n\`(h)it\` \`(s)tand\` \`(e)nd\``, { embed })
		if (final) return;
        await run();
    }

    gambed();
	
	async function dealersTurnEnd() {
		if (cards.bot.length < 5 && addCards("bot") <= 16) {
			cards.bot.push(deal());
			if (cards.bot.includes(getValue(11)) && addCards("bot") > 21) cards.bot[cards.bot.indexOf(getValue(11))] = 1;
			return await dealersTurnEnd();
		}    
        return await gambed(false);
	}

    async function run() {
        const filter = m => m.author == message.author
        message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
            .then(async collected => {
                switch (collected.first().content.toLowerCase().slice(0, 1)) {
                    case "h":
                        cards.user.push(deal());
						if (cards.user.includes(getValue(11)) && addCards("bot") > 21) cards.user[cards.user.indexOf(getValue(11))] = 1;
                        return gambed(false);
                        break;
                    case "s":
                        stood = true;
                        return await dealersTurnEnd();
                        break;
                    case "e":
                        await Economy.add(message.member, bet / 2)
                        return message.zreply(`${client.util.emoji("empty", message.guild)} You ended your game of Blackjack. Half of what you bet was taken as a penalty.`)
                        break;
					default:
						message.zreply(`${client.util.emoji("warning", message.guild)} You gave an invalid response. Do you want to continue playing Blackjack? \
If you end now, you'll lose half of your bet as a penalty. \`(y)it\` \`(n)tand\``)
						const filter = m => m.author == message.author
						message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
							.then(async collected => {
								if (collected.first().content.toLowerCase().slice(0, 1) == "y") {
									return gambed(false);
								} else {
									await Economy.add(message.member, bet / 2)
									return message.zreply(`${client.util.emoji("empty", message.guild)} You ended your game of Blackjack. \
Half of what you bet was taken as a penalty.`)
								}
							}).catch(async (collected) => {
								await Economy.add(message.member, bet / 2)
								if (!collected.size) return message.zreply(`${client.util.emoji("empty", message.guild)} Your game of blackjack has ended because \
you didn't reply with an answer in time.`)
							});
                        break;
                }
            }).catch(async (collected) => {
                await Economy.add(message.member, bet / 2)
                if (!collected.size) return message.zreply(`${client.util.emoji("empty", message.guild)} Your game of blackjack has ended because \
you didn't reply with an answer in time.`)
            })
    }
}