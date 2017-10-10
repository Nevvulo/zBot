const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const fs = require('fs');
const challenge = require('./../../commands/challenge.js');
const User = require('./../../models/User.js');

//Challenges
var health = {};
var healLevel = {};
var timesHealed = {};
var missTurn = {};
var armor = {};
var specialAbilityUsed = {};
var turn = "";
var oppturn = "";
var init = true;
var end = false;
var confend = false;

async function newMessage(message) {
    if (message.author.bot) return;
    if (end) {
        challenge.startedChallenge = "false";
    }

    var msg = message.content;
    //CHALLENGE
        function sendBoth(messageToSend) {
            players = [client.users.get(challenge.author.id), client.users.get(challenge.enemy.id)]
            for (i in players) {
                players[i].send(messageToSend)
            }
        }
        //CHALLENGE
        if (challenge.startedChallenge) {
            // Initialization variables
            if (init) {
                health[challenge.author] = 100;
                health[challenge.enemy] = 100;
                armor[challenge.author] = 0;
                armor[challenge.enemy] = 0;
                healLevel[challenge.author] = 1;
                healLevel[challenge.enemy] = 1;
                specialAbilityUsed[challenge.enemy.id] = false;
                specialAbilityUsed[challenge.author.id] = false;
                timesHealed[challenge.enemy.id] = 1
                timesHealed[challenge.author.id] = 1
                turn = challenge.author;
                oppturn = challenge.enemy;
                init = false;
            }
            userChallenge = await User.findOne({ where: { userID: turn.id, guildID: message.guild.id } });
            // Only check for messages that start with attack, defend, heal or end.
            if (msg == "attack" || msg == "defend" || msg == "heal" || msg == "end" || msg == "special") {
                message.delete();

                // Check for turn
                if (message.author.id != turn.id) {
                    message.reply(":crossed_swords: **CHALLENGE**: It is not your turn!");
                    return;
                }

                if (missTurn[turn.id] == true) {
                    sendBoth(":crossed_swords: **CHALLENGE**: " + turn + " missed their turn.");
                    missTurn[turn.id] = false;
                    //END TURN
                    let swapturn = turn
                    turn = oppturn
                    oppturn = swapturn

                    if (userChallenge.weapon !== "wooden") {
                        sendBoth(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.")
                        turn.send("What do you want to do? `attack` `defend` `heal` `special` `end`");
                    } else {
                        sendBoth(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.")
                        turn.send("What do you want to do? `attack` `defend` `heal` `end`");
                    }

                    return;
                }

                if (msg.toLowerCase().startsWith("attack")) {
                    let damage = Math.round(Math.random() * (27 - 7) + 7) - armor[oppturn];
                    let miss = Math.round(Math.random() * (3 - 1) + 1)

                    //1/3 chance to miss
                    if (miss != 4 || specialAbilityUsed[oppturn.id] == true) {
                        specialAbilityUsed[oppturn.id] == false
                        //Deduct health
                        health[oppturn] = health[oppturn] - damage;

                        //Check if user has defeated enemy
                        if (health[turn] < 1) {
                            var winner = oppturn;
                            var loser = turn;

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
                            let verbs = ["annihilated", "knocked out", "flogged", "destroyed", "crushed", "ruined", "eradicated", "dismantled", "wiped out", "erased", "squashed", "shattered"]
                            var verb = verbs[Math.floor(Math.random() * verbs.length)];

                            sendBoth(":crossed_swords: **CHALLENGE**: " + wowword + " " + winner + " " + noun + " " + verb + " " + loser + "! Good fight!")
                            return;
                        }

                        sendBoth(":crossed_swords: **CHALLENGE**: " + oppturn + " took **" + damage + "** damage. They now have **" + health[oppturn] + " HP**.")
                    } else {
                        sendBoth(":crossed_swords: **CHALLENGE**: " + oppturn + " dodged " + turn + "'s attack!");
                    }

                    //END TURN
                    let swapturn = turn
                    turn = oppturn
                    oppturn = swapturn
                }

                if (msg.toLowerCase().startsWith("defend")) {
                    let defense = Math.round(Math.random() * (5 - 2) + 2)
                    if (armor[turn] + defense > 7) {
                        message.reply(":no_entry_sign: **NOPE**: You are at the maximum defense level!");
                        armor[turn] = 7;
                        return;
                    }
                    armor[turn] = armor[turn] + defense;
                    sendBoth(":crossed_swords: **CHALLENGE**: " + turn + " equiped some armor. They now take **" + defense + " HP** less damage for every attack.")

                    //END TURN
                    let swapturn = turn
                    turn = oppturn
                    oppturn = swapturn
                }

                if (msg.toLowerCase().startsWith("heal")) {
                    if (timesHealed[turn.id] < 4) {
                        let healAmount = Math.round(Math.random() * (12 - 5) + 5)
                        timesHealed[turn.id] = timesHealed[turn.id] + 1

                        // HEAL POTION LEVEL HANDLING
                        if (healLevel[turn] == 1) {
                            healAmount = Math.round(Math.random() * (12 - 5) + 5)
                        } else if (healLevel[turn] == 2) {
                            healAmount = Math.round(Math.random() * (15 - 8) + 8)
                        } else if (healLevel[turn] == 3) {
                            healAmount = Math.round(Math.random() * (18 - 11) + 11)
                        }

                        health[turn] = health[turn] + healAmount;
                        sendBoth(":crossed_swords: **CHALLENGE**: " + turn + " drank a **level " + healLevel[turn] + "** health potion. They healed **" + healAmount + " HP**, bringing them up to **" + health[turn] + " HP**.");

                        //END TURN
                        let swapturn = turn
                        turn = oppturn
                        oppturn = swapturn
                    } else {
                        message.reply(":no_entry_sign: **NOPE**: You can't heal anymore.");
                        return;
                    }
                }



                if (msg.toLowerCase().startsWith("special")) {
                    if (userChallenge.weapon == "diamond") {
                        if (specialAbilityUsed[turn.id] == false) {

                            health[turn] = health[turn] + 20;
                            missTurn[oppturn.id] = true;
                            sendBoth(":crossed_swords: **CHALLENGE**: " + turn + " used their special ability: **Diamond Frost**! " + turn + " gained **20 HP** and " + oppturn + " will miss their next turn.");
                            specialAbilityUsed[turn.id] = true;

                        } else {
                            message.reply(":no_entry_sign: **NOPE**: You've already used your special ability.");
                        }
                    } else if (userChallenge.weapon == "iron") {
                        if (specialAbilityUsed[turn.id] == false) {

                            sendBoth(":crossed_swords: **CHALLENGE**: " + turn + " used their special ability: **Cutting Edge**! The sharp, iron blade cuts " + oppturn + " badly, causing them to bleed. They will lose **5 HP** for every turn they take.");
                            specialAbilityUsed[challenge.author.id] = true;
                        } else {
                            message.reply(":no_entry_sign: **NOPE**: You've already used your special ability.");
                        }
                    } else {
                        message.reply(":no_entry_sign: **NOPE**: You don't have a special ability to use.");
                    }

                    //END TURN
                    let swapturn = turn
                    turn = oppturn
                    oppturn = swapturn
                    var userChallenge = await User.findOne({ where: { userID: turn.id, guildID: message.guild.id } });
                }

                if (msg.toLowerCase().startsWith("end")) {
                    if (confend) {
                        sendBoth(":crossed_swords: **CHALLENGE**: The war between " + turn + " and " + oppturn + " has **ended**.");
                        end = true;
                        return;
                    } else {
                        confend = true;
                        turn.send(":crossed_swords: **CHALLENGE**: Are you sure you want to end this challenge? Type `end` again to confirm.");
                        return;
                    }
                }
                if (userChallenge.weapon !== "wooden") {
                    sendBoth(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `special` `end`");
                } else {
                    sendBoth(":crossed_swords: **CHALLENGE**: It is " + turn + "'s turn.\nWhat do you want to do? `attack` `defend` `heal` `end`");
                }
                return;
            } else {
              if (message.channel.type == 'dm') {
                if (message.author.id == turn.id) {
                    oppturn.send(":speech_left: " + message.author.username + " says **>** " + msg)
                } else {
                    turn.send(":speech_left: " + message.author.username + " says **>** " + msg)
                }
              }
            }
        }
}


module.exports = {
    name: "Challenge",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
}
