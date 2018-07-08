const Discord = require("discord.js");
const challenge = require('./../../commands/fun/challenge.js');
const Weapon = require('./Weapon.js');
const UserInfo = require('./../../models/user/User.js');
const Economy = new (require("./../../structures/user/Economy.js"));
const Constants = require("./../../util/Constants.js")

var challenges = [];
var idCounter = -1;
var lastGamePlayed = {};

module.exports = class Challenge {
    constructor(client) {
        this.client = client;
    }

    init(enemy, author, guild) {
        idCounter++
        lastGamePlayed[enemy.id] = idCounter;
        lastGamePlayed[author.id] = idCounter;
        challenges.push({
            id: idCounter,
            turn: author,
            oppturn: enemy,
            guild: guild,
            userTurn: {
                "health": 100,
                "healLevel": 1,
                "healthPotions": 3,
                "missTurn": false,
                "isBleeding": false,
                "armor": 0,
                "specialAbilityUsed": false
            },
            userOppturn: {
                "health": 100,
                "healLevel": 1,
                "healthPotions": 3,
                "missTurn": false,
                "isBleeding": false,
                "armor": 0,
                "specialAbilityUsed": false
            },
            confirmEnd: false,
            end: false,
        })

        function givePots(user, amount) {
            challenges[idCounter]["user" + user.charAt(0).toUpperCase() + user.slice(1)].healthPotions += amount;
        }

        if (author.upvoted) { givePots("turn", 1); this.client.util.log("[CHALLENGE] User upvoted, awarding 1 extra health potion"); }
        if (author.patron.patron) { givePots("turn", 3); this.client.util.log("[CHALLENGE] User is a patron, awarding 3 extra health potion"); }
        if (enemy.upvoted) { givePots("oppturn", 1); this.client.util.log("[CHALLENGE] Enemy upvoted, awarding 1 extra health potion"); }
        if (enemy.patron.patron) { givePots("oppturn", 3); this.client.util.log("[CHALLENGE] Enemy is a patron, awarding 3 extra health potion"); }
        return idCounter;
    }

    sendBoth(id, messageToSend) {
        let players = [this.client.users.get(challenges[id].author.id), this.client.users.get(challenges[id].enemy.id)]
        for (let i in players) {
            players[i].send(messageToSend)
        }
    }

    async run(message) {
        if (message.channel.type !== 'dm') return;
        if (message.author.bot) return;
        var msg = message.content;
        var prefix = (isNaN(Number(msg.split(" ").slice(0)[0])) ? lastGamePlayed[message.author.id] : Number(msg.split(" ").slice(0)[0]))
        lastGamePlayed[message.author.id] = prefix;
        var Game = challenges[prefix]
        if (!Game) return;
        if (Game.turn.id !== message.author.id && Game.oppturn.id !== message.author.id) return message.zreply("`" + prefix + "` | " + this.client.util.emoji("nope",
            Game.guild) + " You don't have access to this game!");
        if (Game.end) {
            Game = undefined;
            return;
        }

        var command = msg;
        var args = msg.substr(prefix.length).split(" ").slice(0).join(" ");
        if (msg.toLowerCase().startsWith(prefix)) {
            command = msg.substr(prefix.length).split(" ").slice(1, 2).toString();
            args = msg.substr(prefix.length).split(" ").slice(1).join(" ");
        } else {
            command = msg
            args = msg.substr(prefix.length).split(" ").slice(0).join(" ");
        }

        function sendBoth(id, messageToSend) {
            let players = [this.client.users.get(challenges[id].turn.id), this.client.users.get(challenges[id].oppturn.id)]
            for (let i in players) {
                players[i].send(messageToSend)
            }
        }

        function giveHealthPotions(user, amount) {
            Game["user" + user.charAt(0).toUpperCase() + user.slice(1)].healthPotions += amount;
        }

        //CHALLENGE
        function applyDamage(amount, user, canMiss) {
            let miss = Math.round(Math.random() * (4 - 1) + 1)
            if (!canMiss) Game["user" + user.charAt(0).toUpperCase() + user.slice(1)].health -= amount;
            //1/4 chance to miss
            if (miss !== 4 && canMiss) {
                //Deduct health
                Game["user" + user.charAt(0).toUpperCase() + user.slice(1)].health -= amount;
            } else {
                return 0;
            }
            return amount;
        }

        function heal(amount, user, potionLevel) {
            Game["user" + user.charAt(0).toUpperCase() + user.slice(1)].healthPotions -= 1;
            Game["user" + user.charAt(0).toUpperCase() + user.slice(1)].health += amount;
            this.client.util.log(`[CHALLENGE] ${user} healed ${amount}`)
        }

        var userProfile = await UserInfo.findOne({ where: { userID: Game.turn.id, guildID: Game.guild.id } });
        // Only check for messages that start with attack, defend, heal or end.
        if (command == "attack" || command == "defend" || command == "heal" || command == "end" || command == "special" || command == "stats") {
            if (command.toLowerCase().startsWith("stats")) {
                const embed = new Discord.MessageEmbed()
                embed.setAuthor('Challenge » Game ' + prefix, this.client.user.displayAvatarURL())
                embed.setDescription(":clipboard: Game statistics for challenge `#" + prefix + "`\n" + Game.oppturn.username + " vs. " + Game.turn.username)
                embed.addField("Turn", "It's currently **" + Game.turn.username + "**'s turn.")
                embed.addField("Health", Game.turn.username + "'s health ─ **" + Game.userTurn.health + "**\n" + Game.oppturn.username +
                    "'s health ─ **" + Game.userOppturn.health + "**")
                embed.addField("Armor", Game.turn.username + "'s armor level ─ **" + Game.userTurn.armor + "**\n" + Game.oppturn.username +
                    "'s armor level ─ **" + Game.userOppturn.armor + "**")
                embed.setColor("#ff5722")
                embed.setTimestamp(new Date())
                message.author.send({ embed })
                return;
            }

            // Check for turn
            if (message.author.id != Game.turn.id) {
                message.zreply("`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: It isn't your turn.");
                return;
            }

            if (Game.userTurn.missTurn) {
                sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: **" + Game.turn.username +
                    "** missed their turn.");
                Game.userTurn.missTurn = false;
                //END TURN
                let swapturn = Game.turn
                let swapturnDetails = Game.userTurn
                Game.turn = Game.oppturn
                Game.userTurn = Game.userOppturn
                Game.oppturn = swapturn
                Game.userOppturn = swapturnDetails
                return endTurn()
            }

            if (command.toLowerCase().startsWith("attack")) {
                let damage = Math.round(Math.random() * (27 - 7) + 7) - Game.userOppturn.armor;
                damage = applyDamage(damage, "oppturn", true)

                //1/3 chance to miss
                if (damage == false) {
                    sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: **" + Game.oppturn.username +
                        "** dodged **" + Game.turn.username + "**'s attack!");
                    this.client.util.log(`[CHALLENGE] ${Game.oppturn.username} dodged ${Game.turn.username}`)
                    //END TURN
                    let swapturn = Game.turn
                    let swapturnDetails = Game.userTurn
                    Game.turn = Game.oppturn
                    Game.userTurn = Game.userOppturn
                    Game.oppturn = swapturn
                    Game.userOppturn = swapturnDetails
                    return endTurn()
                }

                //Check if user has defeated enemy
                if (Game.userTurn.health < 1 || Game.userOppturn.health < 1) {
                    var winner = (Game.userOppturn.health < 1 ? Game.turn : Game.oppturn);
                    var loser = (Game.userOppturn.health < 1 ? Game.oppturn : Game.turn);
                    var wowword = "";
                    var verb = "";
                    var noun = "";

                    // WOW WORD
                    let wowwords = ["Holy cow!", "Wow!", "I did not expect that!", "God damn!", "Oh my god!", "No way!", "Holy crap!", "Dang!"]
                    var wowword = wowwords[Math.floor(Math.random() * wowwords.length)];

                    // NOUN
                    let nouns = ["just", "totally", "kinda", "100%", "absolutely", "seriously", "legitimately", "completely"]
                    var noun = nouns[Math.floor(Math.random() * nouns.length)];

                    // VERB
                    let verbs = ["annihilated", "knocked out", "flogged", "destroyed", "crushed", "ruined", "eradicated", "dismantled", "wiped out",
                        "erased", "squashed", "shattered"]
                    var verb = verbs[Math.floor(Math.random() * verbs.length)];

                    sendBoth(prefix,
                        `:trophy: **${winner.username}** is victorious!\n────────────────\n\n:crossed_swords: **CHALLENGE**: ${wowword} ${winner.username} ${noun} ${verb} ${loser.username}! Good fight!`
                    )
                    sendBoth(prefix, this.client.util.emoji("ok", Game.guild) + " **GAME ENDED**: This game will close in 30 seconds.")
                    const winnerWinnings = 250;
                    winner.send(`\`Winner Reward\`\nYou earned \`${Constants.CurrencySettings.symbol}${winnerWinnings}\` for winning this challenge!`)
                    await Economy.add(Game.guild.members.get(winner.id), winnerWinnings)

                    const loserWinnings = 30;
                    loser.send(`\`Participation Reward\`\nYou earned \`${Constants.CurrencySettings.symbol}${loserWinnings}\` for partaking in this challenge.`)
                    await Economy.add(Game.guild.members.get(loser.id), loserWinnings)

                    this.client.util.log(`[CHALLENGE] ${winner.username} won a challenge against ${loser.username}`)
                    setTimeout(function() { Game.end = true; this.client.util.log(`[CHALLENGE] Challenge ${prefix} ended because someone won`); }, 30000)
                    return;
                }

                sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: **" + Game.oppturn.username + "** took **" +
                    damage + "** damage. They now have **" + Game.userOppturn.health + " HP**.")
                this.client.util.log(`[CHALLENGE] ${Game.oppturn.username} took ${damage} damage against ${Game.turn.username}, they now have ${Game.userOppturn.health} health`)

                //END TURN
                let swapturn = Game.turn
                let swapturnDetails = Game.userTurn
                Game.turn = Game.oppturn
                Game.userTurn = Game.userOppturn
                Game.oppturn = swapturn
                Game.userOppturn = swapturnDetails
                return endTurn()
            }

            if (command.toLowerCase().startsWith("defend")) {
                let defense = Math.round(Math.random() * (5 - 2) + 2)
                if (Game.userTurn.armor + defense > 7) {
                    message.zreply("`" + prefix + "` | " + this.client.util.emoji("nope", Game.guild) + " You are at the maximum defense level!");
                    Game.userTurn.armor = 7;
                    return;
                }
                Game.userTurn.armor += defense;
                sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: **" + Game.turn.username +
                    "** equiped some armor. They now take **" + defense + " HP** less damage for every attack.")
                this.client.util.log(`[CHALLENGE] ${Game.turn.username} increased their defense points by ${defense}`)
                //END TURN
                let swapturn = Game.turn
                let swapturnDetails = Game.userTurn
                Game.turn = Game.oppturn
                Game.userTurn = Game.userOppturn
                Game.oppturn = swapturn
                Game.userOppturn = swapturnDetails
                return endTurn()
            }

            if (command.toLowerCase().startsWith("heal")) {
                if (Game.userTurn.healthPotions > 0) {
                    let healAmount = Math.round(Math.random() * (12 - 5) + 5)
                    // HEAL POTION LEVEL HANDLING
                    if (Game.userTurn.healLevel == 1) {
                        healAmount = Math.round(Math.random() * (12 - 5) + 5)
                    } else if (Game.userTurn.healLevel == 2) {
                        healAmount = Math.round(Math.random() * (15 - 8) + 8)
                    } else if (Game.userTurn.healLevel == 3) {
                        healAmount = Math.round(Math.random() * (18 - 11) + 11)
                    }

                    heal(healAmount, "turn", Game.userTurn.healLevel)
                    sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: **" + Game.turn.username +
                        "** drank a **level " + Game.userTurn.healLevel + "** health potion. They healed **" + healAmount +
                        " HP**, bringing them up to **" + Game.userTurn.health + " HP**.");
                    //END TURN
                    let swapturn = Game.turn
                    let swapturnDetails = Game.userTurn
                    Game.turn = Game.oppturn
                    Game.userTurn = Game.userOppturn
                    Game.oppturn = swapturn
                    Game.userOppturn = swapturnDetails
                    return endTurn()
                } else {
                    message.zreply("`" + prefix + "` | " + this.client.util.emoji("nope", Game.guild) + " You can't heal anymore.");
                    return;
                }
            }



            if (command.toLowerCase().startsWith("special")) {
                var userProfile = await UserInfo.findOne({ where: { userID: Game.turn.id, guildID: Game.guild.id } });
                if (Game.userTurn.specialAbilityUsed) return message.zreply("`" + prefix + "` | " + this.client.util.emoji("nope", Game.guild) +
                    " You've already used your special ability.");
                var userWeapon = Weapon.grabWeapon(userProfile.weapon);
                if (!Weapon.canSpecial(userWeapon) || !userWeapon.specialAbility) return message.zreply("`" + prefix + "` | " + this.client.util.emoji("nope", Game.guild) +
                    " You don't have a special ability to use.");

                let damage = Math.round(Math.random() * (27 - 7) + 7) * userWeapon.damage - Game.userOppturn.armor;
                sendBoth(prefix, "`" + prefix + "` | " +
                    `:crossed_swords: **CHALLENGE**: **${Game.turn.username}** used their special ability!\n────────────────\n**${userWeapon.specialAbility.name.toUpperCase()}**\n${userWeapon.specialAbility.description}`
                );
                this.client.util.log(`[CHALLENGE] ${Game.turn.username} used their special ability, ${userWeapon.specialAbility.name}`)

                if (userWeapon.type == "stone") {
                    let damage = Math.round(Math.random() * (24 - 10) + 10)
                    applyDamage(damage, "oppturn", false)
                    sendBoth(prefix, "`" + prefix + "` | " +
                        `:crossed_swords: **CHALLENGE**: **${Game.oppturn.username}** was hit by a falling rock! It dealt **${damage} HP**, leaving them with **${Game.userOppturn.health} HP**.`
                    )
                }

                if (userWeapon.type == "steel") {
                    Game.userOppturn.isBleeding = true;
                    sendBoth(prefix, "`" + prefix + "` | " +
                        `:crossed_swords: **CHALLENGE**: **${Game.oppturn.username}** is now bleeding. They will take **5 HP** of damage for every turn they take.`
                    )
                }

                if (userWeapon.type == "diamond") {
                    Game.userOppturn.missTurn = true;
                    Game.userTurn.health += 15;
                }

                if (userWeapon.type == "platinum") {
                    applyDamage(damage, "oppturn", false)
                    sendBoth(prefix, "`" + prefix + "` | " +
                        `:crossed_swords: **CHALLENGE**: **${Game.turn.username}** struck their almighty power directly on top of **${Game.oppturn.username}**. It dealt **${damage} HP**, leaving them with **${Game.userOppturn.health} HP**.`
                    )
                }
                Game.userTurn.specialAbilityUsed = true;
                //END TURN
                let swapturn = Game.turn
                let swapturnDetails = Game.userTurn
                Game.turn = Game.oppturn
                Game.userTurn = Game.userOppturn
                Game.oppturn = swapturn
                Game.userOppturn = swapturnDetails
                return endTurn()
            }

            if (command.toLowerCase().startsWith("end")) {
                if (Game.confirmEnd) {
                    sendBoth(prefix, "`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: The war between " + Game.turn + " and " +
                        Game.oppturn + " has **ended**.");
                    this.client.util.log(`[CHALLENGE] Challenge ${prefix} ended by forfeit`)
                    Game.end = true;
                    return;
                } else {
                    Game.confirmEnd = true;
                    Game.turn.send("`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) +
                        " **CHALLENGE**: Are you sure you want to end this challenge? Type `end` again to confirm.");
                    return;
                }
            }

            async function endTurn() {
                const userProfile = await UserInfo.findOne({ where: { userID: Game.turn.id, guildID: Game.guild.id } });
                const userWeapon = Weapon.grabWeapon(userProfile.weapon);
                const words = ["It's now", "It is now", "It is", "It's"]
                const sentence = words[Math.floor(Math.random() * words.length)];
                Game.oppturn.send("`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) + " **CHALLENGE**: " + sentence + " **" + Game.turn.username +
                    "**'s turn.");
                Game.turn.send("`" + prefix + "` | " + this.client.util.emoji("challenge", Game.guild) +
                    " **CHALLENGE**: It's your turn!\nWhat do you want to do? `attack` `defend` `heal` " + (Weapon.canSpecial(userWeapon) ?
                        "`special`" : "") + " `stats` `end`");
                return;
            }


        } else {
            if (message.channel.type == 'dm' && Game.end == false) {
                this.client.util.log(`[CHALLENGE] [CHAT] ${message.author.username} ─ ${args}`)
                if (message.author.id == Game.turn.id) {
                    Game.oppturn.send("`" + prefix + "` | " + this.client.util.emoji("edit", Game.guild) + " **" + message.author.username.toUpperCase() + "** ─ " +
                        args)
                } else {
                    Game.turn.send("`" + prefix + "` | " + this.client.util.emoji("edit", Game.guild) + " **" + message.author.username.toUpperCase() + "** ─ " + args)
                }
            }
        }
    }
}
