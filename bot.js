/****************************************
 * 
 *   AstralMod: Moderation bot for AstralPhaser Central and other Discord servers
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * *************************************/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const readline = require('readline');
const csvWriter = require('csv-write-stream');



const rl = readline.createInterface({
    input: fs.createReadStream('settings.txt')
});


var expletiveFilter = true;
var doModeration = {};
var panicMode = {};
var lastMessages = {};
var sameMessageCount = {};
var smallMessageCount = {};
var lastUserInteraction = {};
var poweroff = false;
var warntoggle = false;
var warnMember = null;
var banMember = null;
var interrogMember = null;
var bulletinTimeout;
var numDel;
var botMessageTimeout;
var botDelMessage = {};
var warnReason = {};
var banReason = {};
var moderatorWarn = {};
var moderatorBan = {};
var doNotDelete = {};
var poll = {};
var pollquestion = {};

//Reactions to poll
var messageReact = {};


var commandMod = "off";
var commandFilter = "off";
var commandRm = "off";
var commandUinfo = "off";
var commandWarn = "off";
var commandBan = "off";
var commandSay = "off";
var commandSetgame = "off";
var commandPanic = "off";
var commandCancel = "off";
var commandHelp = "off";

    console.log('● Settings ●');
    console.log("");

rl.on('line', function(line) {
    console.log("» " + line);
    if (line.includes("mod:on")) {commandMod = "on"} 
    else if (line.includes("filter:on")) {commandFilter = "on"}
    else if (line.includes("rm:on")) {commandRm = "on"}
    else if (line.includes("uinfo:on")) {commandUinfo = "on"}
    else if (line.includes("warn:on")) {commandWarn = "on"}
    else if (line.includes("ban:on")) {commandBan = "on"}
    else if (line.includes("say:on")) {commandSay = "on"}
    else if (line.includes("setgame:on")) {commandSetgame = "on"}
    else if (line.includes("panic:on")) {commandPanic = "on"}
    else if (line.includes("cancel:on")) {commandCancel = "on"}
    else if (line.includes("help:on")) {commandHelp = "on"}
});

client.login('MzAwNTUyMzc0MDg1MjIyNDAw.C8udkQ.WqOWKPikEVT6cdSeGMuyf2Khe3I');



function setGame() {
    var presence = {};
    presence.game = {};
    presence.status = "online";
    presence.afk = false;


    switch (Math.floor(Math.random() * 1000) % 22) {
        case 0:
            presence.game.name = "with various buttons";
            break; //SCRUATCHO
        case 1:
            presence.game.name = "xail's stream";
            break;
        case 2:
            presence.game.name = "wrong button";
            break;
        case 3:
            presence.game.name = "with an internal bug";
            break;
        case 4:
            presence.game.name = "around";
            break;
        case 5:
            presence.game.name = "bot games";
            break;
        case 6:
            presence.game.name = "with ones and zeroes";
            break;
        case 7:
            presence.game.name = "bot things";
            break;
        case 8:
            presence.game.name = "with supa weapon";
            break;
        case 9:
            presence.game.name = "with puzzles";
            break;
        case 10:
            presence.game.name = "rewinding time";
            break;
        case 11:
            presence.game.name = "checking archives";
            break;
        case 12:
            presence.game.name = "being unbreakable";
            break;
        case 13:
            presence.game.name = "with sandwiches";
            break;
        case 14:
            presence.game.name = "drawing pokemon";
            break;
        case 15:
            presence.game.name = "obsessing";
            break;
        case 16:
            presence.game.name = "the waiting game";
            break;
        case 17:
            presence.game.name = "bending space";
            break;
        case 18:
            presence.game.name = "with hexagons";
            break;
        case 19:
            presence.game.name = "with space and time";
            break;
        case 20:
            presence.game.name = "being a ninja";
            break;
        case 21:
            presence.game.name = "bot:help for more info";
            break;
    }
    client.user.setPresence(presence);
}

client.on('ready', () => {
    console.log(" ");
    console.log('● You can change these settings as you want in "settings.txt".');
    console.log(" ");
    console.log(" ");
    console.log("● XailBot is ready!");
    console.log(" ");
    console.log(" ");
    client.setInterval(setGame, 300000);
    setGame();
    doModeration[300575580116746240] = true;
});

function getBoshyTime(guild) {
    if (guild.id == 300575580116746240) { //AstralPhaser
        return ":warning:";
    }
}

//var prank = true;
//IT'S JUST A PRANK BRO

function reactionChecker(messageReaction, user) {
    if (messageReaction.message.author.id == 300552374085222400 && messageReaction.message.content.includes("poll") && messageReaction.message.content.includes("created")) {
        messageReact = messageReaction;
    }
    
}

function messageChecker(oldMessage, newMessage) {
    var message;
    if (newMessage == null) {
        message = oldMessage;
    } else {
        message = newMessage;
    }
    var msg = message.content;

    if (message.guild == null) return;

    if (botDelMessage[message.guild.id] == null) {
        botDelMessage[message.guild.id] = false;
    }

    if (botDelMessage[message.guild.id]) {
        if (msg == "mod:deletemessages" && (message.member.roles.find("name", "Head of the Flock") || message.member.roles.find("name", "Admin"))) {
            message.channel.send(':rotating_light: Messages from the bot will no longer automatically be deleted.');
            botDelMessage[message.guild.id] = false;
            console.log("» Automatic message deletion for the bot is now off.");
            message.delete();
            return;
        }
        if (message.author.id == 300552374085222400 && doNotDelete == false) {
            console.log("▲ Bot is about to delete: " + message)
            message.delete(10000)
        }
    }
       

    if (panicMode[message.guild.id] == null) {
        panicMode[message.guild.id] = false;
    }



    if (panicMode[message.guild.id]) {
        if (msg == "mod:panic" && (message.member.roles.find("name", "Head of the Flock") || message.member.roles.find("name", "Adept Fleece Police"))) {
            message.channel.send(':rotating_light: Panic mode is now off.');
            panicMode[message.guild.id] = false;
            console.log("▲ Panic is now off.");
            message.delete();
            return;
        }
        message.delete();
    }

 
    
    
    /*if (message.channel.id == 277943393231831040) {
        var line = "[" + message.createdAt.toUTCString() + " - " + message.member.displayName + "] " + msg + "\n";
        fs.appendFile("brokerules.txt", line, function(err) {
            
        });
    }*/

    if (message.author.id != 280495817901473793 && !message.author.bot) {
        //Server Detection:
        //AstralPhaser Central: 277922530973581312
        //Michael's Stuff     : 234414439330349056
        //AKidFromTheUK       : 285740807854751754

        if (doModeration[message.guild.id]) { //Check if we should do moderation on this server
            if ((expletiveFilter && message.guild.id == 300575580116746240)) { //Check for expletives only if on AstralPhaser Central or theShell
                //Check for expletives
                var exp = msg.search(/(\b|\s|^|\.|\,|\ )(shit|shite|shitty|bullshit|fuck|fucking|ass|penis|cunt|faggot|fag|wank|wanker|nigger|nigga|bastard|thisisnotarealwordbutatestword)(\b|\s|$|\.|\,|\ )/i);
                if (exp != -1) { //Gah! They're not supposed to say that!
                    console.log("▲ Expletive caught at " + parseInt(exp));
                    switch (Math.floor(Math.random() * 1000) % 7) {
                        case 0:
                            message.reply("I'm very disappointed in you. This is me :angry:");
                            break;
                        case 1:
                            message.reply("Hey! Let's not have any of that please.");
                            break;
                        case 2:
                            message.reply("No thanks.");
                            break;
                        case 3:
                            message.reply("Cool. Now let's not forget the rules.");
                            break;
                        case 4:
                            message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
                            break;
                        case 5:
                            message.reply("Hey! That was a swear! No!");
                            break;
                        case 6:
                            message.reply("This situation calls for some passive resistance!");
                            break;
                    }
                    doNotDelete = false;
                    message.delete();
                    return;
                }

                if (message.guild.id == 300575580116746240) {


                    //Check for caps
                    if (msg.match(/[A-Z]/gm) != null && msg.match(/[A-Z]/gm).length > (parseFloat(msg.length) * 0.8)) {
                        console.log("▲ Caps filter kicking in!");
                        switch (Math.floor(Math.random() * 1000) % 6) {
                            case 0:
                                message.reply("Shh...");
                                break;
                            case 1:
                                message.reply("The community likes peace and quiet.");
                                break;
                            case 2:
                                message.reply("Isn't it weird when you're reading... and then you see a bunch of caps?");
                                break;
                            case 3:
                                message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
                                break;
                            case 4:
                                message.reply("DON'T SHOUT IN HERE K");
                                break;
                            case 5:
                                message.reply("Whoa whoa, slow down my friend! No need for raised voices!");
                                break;
                        }
                        doNotDelete = false;
                        message.delete();
                        return;
                    }
                }
            }
        }

        if (message.mentions != null && message.mentions.users != null) {
            doNotDelete = true;
            if (message.mentions.users.has("300552374085222400")) {
                if (message.author.id == 159310300275802112) {
                    message.reply("BEGONE. You called my creator mean. :sob:"); //need to do something with this
                } else {
                    if (msg.toLowerCase().includes("stop") || (msg.toLowerCase().includes("shut") && msg.toLowerCase().includes("up"))) {

                        switch (Math.floor(Math.random() * 1000) % 3) {
                            case 0:
                                message.reply(":no_entry_sign: NOPE: I shall talk as much as I like.");
                                break;
                            case 1:
                                message.reply(":no_entry_sign: NOPE: You shu... I'd better not say that actually");
                                break;
                            case 2:
                                message.reply(":no_entry_sign: NOPE: Just no.");
                                break;
                        }
                    } else if (msg.toLowerCase().includes("fuck you") || msg.toLowerCase().includes("fuck off") || msg.toLowerCase().includes("shit")) {
                        message.reply("Want a :hammer:?");
                    } else if (msg.toLowerCase().includes("how") && msg.toLowerCase().includes("you")) {
                        message.reply("I'm doing OK I suppose.");
                    } else if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("yep") || msg.toLowerCase().includes("right?") || msg.toLowerCase().includes("isn't it?")) {
                        message.reply("Well, I suppose so.");
                    } else if (msg.toLowerCase().includes("no") || msg.toLowerCase().includes("nope")) {
                        message.reply("I guess not.");
                    } else if (msg.toLowerCase().includes("?")) {
                        message.reply("Erm... Maybe? I dunno.");
                    } else if (msg.toLowerCase().includes("what is")) {
                        message.reply("It's probably 42.");
                    } else if (msg.toLowerCase().includes("but first")) {
                        message.reply("We need to talk about parallel universes.");
                    } else if (msg.toLowerCase().includes("shut down") || msg.toLowerCase().includes("shut off") || msg.toLowerCase().includes("turn off") || msg.toLowerCase().includes("go away") || msg.toLowerCase().includes("shutdown")) {
                        message.reply(":white_check_mark: XailBot is now exiting. Goodbye!");
                        message.reply("Haha, just kidding.");
                    } else if (msg.toLowerCase().includes("why is")) {
                        message.reply("I don't know, it's probably because of something Xail did.");
                    } else if (msg.toLowerCase().includes("can i")) {
                        message.reply("It's up to you, mate.");
                    } else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("="))  {
                        message.reply("Sorry, I don't know what it is. Go ask Xail, he'd probably know.");
                    } else if (msg.toLowerCase().includes("xail") || msg.toLowerCase().includes("xailran")) {
                        message.reply("Did you know I am actually based off of that guy?");
                    } else if (msg.toLowerCase().includes("zblake") || msg.toLowerCase().includes("blake")) {
                        message.reply("Oh, I know that guy! He's an absolute legend.");
                    } else if (msg.toLowerCase().includes("puma") || msg.toLowerCase().includes("pumacatrun2")) {
                        message.reply("same");
                    } else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hi")) {
                        message.reply("Is it me you're looking for?");
                    }
                }
            }
        }

        var commandProcessed = false;
        if (msg.toLowerCase().startsWith("mod:") || msg.toLowerCase().startsWith("bot:")) {
            var command = msg.substr(4);
            switch (command) {
                case "ping":
                doNotDelete = true;
                    switch (Math.floor(Math.random() * 1000) % 5) {
                        case 0:
                            message.channel.send(getBoshyTime(message.guild) + ' **PONG!** I want to play pong too... :\'(');
                            break;
                        case 1:
                            message.channel.send(getBoshyTime(message.guild) + ' **PONG!** I love playing pong!');
                            break;
                        case 2:
                            message.channel.send(getBoshyTime(message.guild) + ' **PONG!** Thanks for playing pong with me!');
                            break;
                        case 3:
                            message.channel.send(getBoshyTime(message.guild) + ' **PONG!** Reflect upon this!');
                            break;
                        case 4:
                            message.channel.send(getBoshyTime(message.guild) + ' **PONG!**');
                            break;
                    }
                    commandProcessed = true;
                    break;
                case "pong":
                doNotDelete = true;
                    switch (Math.floor(Math.random() * 1000) % 5) {
                        case 0:
                            message.channel.send(getBoshyTime(message.guild) + ' **PING!** Pings are also cool!');
                            break;
                        case 1:
                            message.channel.send(getBoshyTime(message.guild) + ' **PING!** Do you like playing pong?');
                            break;
                        case 2:
                            message.channel.send(getBoshyTime(message.guild) + ' **PING!** Here\'s the test message you wanted!');
                            break;
                        case 3:
                            message.channel.send(getBoshyTime(message.guild) + ' **PING!** Don\'t breathe this!');
                            break;
                        case 4:
                            message.channel.send(getBoshyTime(message.guild) + ' **PING!**');
                            break;
                    }
                    commandProcessed = true;
                    break;
                case "time":
                    var localtime = new Date();
                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));
                    message.channel.send(':arrow_forward: The time now is ' + localtime.toUTCString());
                    message.delete();
                    commandProcessed = true;
                    break;
                case "help":
                doNotDelete = false;
                    message.channel.send(
                        "Here are some things you can try:\n```\n" +
                        "copyright         Tells you about XailBot\n" +
                        "warranty          Tells you about XailBot\n\n" +
                        "egg               Have an egg.\n" +
                        "ping|pong         Asks XailBot to reply with a message\n\n" +
                        "These commands need to be prefixed with bot:\n" +
                        "```")
                    break;
                case "copyright":
                doNotDelete = false;
                    message.author.sendMessage(
                        "Copyright (C) 2017 Victor Tran and Rylan Arbour\n\n" +
                        "Rewritten by zBlake for use on Rainbow Gaming." +

                        "This program is free software: you can redistribute it and/or modify\n" +
                        "it under the terms of the GNU General Public License as published by\n" +
                        "the Free Software Foundation, either version 3 of the License, or\n" +
                        "(at your option) any later version.\n\n" +

                        "This program is distributed in the hope that it will be useful,\n" +
                        "but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
                        "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
                        "GNU General Public License for more details.\n\n" +

                        "You should have received a copy of the GNU General Public License\n" +
                        "along with this program.  If not, see <http://www.gnu.org/licenses/>"
                    );
                    commandProcessed = true;
                    break;
                case "warranty":
                doNotDelete = false;
                    message.author.sendMessage(
                        "This program is distributed in the hope that it will be useful,\n" +
                        "but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
                        "MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
                        "GNU General Public License for more details.\n"
                    );
                    commandProcessed = true;
                    break;
                case "egg":
                doNotDelete = true;
                    message.reply(":egg:");
                    message.delete();
                    commandProcessed = true;
                    break;
                default:
                    if (command.startsWith("time")) {
                        command = command.substr(5);

                        var hours;

                        switch (command.toLowerCase()) {
                            case "nzdt":
                            case "auckland":
                            case "christchurch":
                            case "new zealand":
                            case "nz":
                                hours = +12;
                                break;
                            case "aedt":
                                hours = +11;
                                break;
                            case "sydney":
                            case "canberra":
                            case "xail":
                            case "xailran":
                            case "server":
                                hours = +10;
                                break;
                            case "aest:":
                                hours = +10;
                                break;
                            case "acdt":
                                hours = +10.5;
                                break;
                            case "adelaide":
                            case "aedt":
                                hours = +9.5;
                                break;
                            case "singapore":
                                hours = +8;
                                break;
                            default:
                                hours = parseFloat(command);
                                command = "UTC " + command + ":00";
                        }

                        if (hours > -14 && hours < 14) {
                            var localtime = new Date();
                            var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + hours * 60) * 60000);
                            var dateString = date.toString();
                            if (dateString == "Invalid Date") {
                                message.channel.send(":no_entry_sign: **ERROR:** That ain't a valid timezone. Don't try to confuse me... *or else...*");
                            } else {
                                dateString = dateString.substring(0, dateString.lastIndexOf(" "));
                                dateString = dateString.substring(0, dateString.lastIndexOf(" "));
                                message.channel.send(':arrow_forward: The time now at ' + command + ' is ' + dateString);
                            }
                        } else {
                            message.channel.send(":no_entry_sign: **ERROR:** That ain't a valid timezone. Don't try to confuse me... *or else...*");
                        }
                        message.delete();
                        commandProcessed = true;
                    }
            }
        }

        if (msg.toLowerCase().startsWith("mod:") && !commandProcessed) {
            //Check for moderator/admin permission

            //Moderator ID: 282068037664768001
            //Admin ID:     282068065619804160
            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) { //Thanks Aren! :D
                var command = msg.substr(4);
                switch (command) {
                    case "filter":
                    doNotDelete = false;
                        if (commandFilter == "on") {
                            if (message.guild.id != 300575580116746240) {
                                message.reply(':no_entry_sign: ERROR: Unable to use that command in this server.');
                            } else {
                                if (expletiveFilter) {
                                    message.channel.send(':arrow_forward: Expletive Filter: on');
                                } else {
                                    message.channel.send(':arrow_forward: Expletive Filter: off');
                                }
                                message.delete();
                            }
                            break;
                        } else {
                            return;
                        }

                    case "filter on":
                    doNotDelete = false;
                        if (commandFilter == "on") {
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                if (expletiveFilter) {
                                    message.channel.send(':arrow_forward: Expletive Filter is already on.');
                                } else {
                                    expletiveFilter = true;
                                    message.channel.send(':white_check_mark: Expletive Filter is now turned on.');
                                    console.log("● Expletive Filter is now on.");
                                }
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is an administrator only command.');
                                message.delete();
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "filter off":
                    doNotDelete = false;
                        if (commandFilter == "on") {
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                if (expletiveFilter) {
                                    expletiveFilter = false;
                                    message.channel.send(':white_check_mark: Expletive Filter is now turned off.');
                                    console.log("● Expletive Filter is now off.");
                                    client.clearInterval(bulletinTimeout);
                                } else {
                                    message.channel.send(':arrow_forward: Expletive Filter is already off.');
                                }
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is an administrator only command.');
                                message.delete();
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "mod":
                    doNotDelete = false;
                        if (commandMod == "on") {
                            if (doModeration[message.guild.id]) {
                                message.channel.send(':arrow_forward: Moderation: on');
                            } else {
                                message.channel.send(':arrow_forward: Moderation: off');
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "random":
                    doNotDelete = false;
                        var channel = client.channels.get("300575580116746241");
                        channel.join()
                            .then(connection => {
                                return connection.playFile('D:\\BOT\\nope.wav', {volume: 0.6});
                            })
                            .then(dispatcher => {
                                dispatcher.on('end', connection.destroy());
                                dispatcher.on('error', console.error);
                                // You can also do things like dispatcher.pause() and dispatcher.end() here.
                            })
                            .catch(console.error);
                        message.delete();
                        break;
                    case "mod on":
                    doNotDelete = false;
                        if (commandMod == "on") {
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                if (doModeration[message.guild.id]) {
                                    message.channel.send(':arrow_forward: Moderation is already on.');
                                } else {
                                    doModeration[message.guild.id] = true;
                                    message.channel.send(':white_check_mark: Moderation is now turned on.');
                                    console.log("● Moderation is now on.");
                                }
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is an administrator only command.');
                                message.delete();
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "mod off":
                    doNotDelete = false;
                        if (commandMod == "on") {
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                if (doModeration[message.guild.id]) {
                                    doModeration[message.guild.id] = false;
                                    message.channel.send(':white_check_mark: Moderation is now turned off. All messages on this server, spam, profane or whatever will be allowed through.');
                                    console.log("● Moderation is now off.");

                                } else {
                                    message.channel.send(':arrow_forward: Moderation is already off.');
                                }
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is an administrator only command.');
                                message.delete();
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "deletemessages":
                    doNotDelete = true;
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                message.channel.send(':rotating_light: Messages from the bot will now automatically be deleted.').then(function() {
                                    botDelMessage[message.guild.id] = true;
                                });
                                console.log("● Automatic message deletion for the bot is now on.");
                                message.delete();
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is an administrator only command.');
                                message.delete();
                            }
                            break;
                    case "panic":
                    doNotDelete = true;
                        if (commandPanic == "on") {
                            if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
                                message.channel.send(':rotating_light: **Panic mode is now on.** All message sending for this server has been turned off.').then(function() {
                                    panicMode[message.guild.id] = true;
                                });
                                console.log("▲ Panic is now on.");
                                message.delete();
                            } else {
                                message.reply(':no_entry_sign: **NOPE:** This is a administrator only command.');
                                message.delete();
                            }
                            break;
                        } else {
                            return;
                        }
                    case "warn":
                    doNotDelete = true;
                        if (commandWarn == "on") {
                            if (warnMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to warn. See mod:help for more information.');

                            } else {
                                message.guild.fetchMember(warnMember).then(function(member) {
                                    embed = new Discord.RichEmbed("warning");
                                    embed.setAuthor("ᴡᴀʀɴɪɴɢ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#E5C01D");
                                    
                                    //begin attempt at csv write
                                    var writer = csvWriter({ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"], sendHeaders:false}) //{ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "No. of Warnings", "Punished by", "Reason"]}
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {flags: 'a'}))
                                    writer.write([member.displayName + "#" + member.user.discriminator, message.createdAt.toUTCString(), "Warning", moderatorWarn.username, warnReason])
                                    writer.end()
                                    console.log("● Successfully wrote warning for user '" + member.displayName + "' to CSV file.")
                                    
                                    var msg = warnMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorWarn + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = warnReason + "\n";
                                    embed.addField("**Reason**", msg);

                                    message.channel.send(":white_check_mark: " + warnMember.displayName + " was succesfully warned.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    warnMember = null;
                                });
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "ban":
                    doNotDelete = true;
                        if (commandBan == "on") {
                            if (banMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to ban. See mod:help for more information.');

                            } else {
                                message.guild.fetchMember(banMember).then(function(member) {
                                    embed = new Discord.RichEmbed("ban");
                                    embed.setAuthor("ʙᴀɴ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#af1c1c");

                                    //begin attempt at csv write
                                    var writer = csvWriter({ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"], sendHeaders:false}) //{ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "No. of Warnings", "Punished by", "Reason"]}
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {flags: 'a'}))
                                    writer.write([member.displayName + "#" + member.user.discriminator, message.createdAt.toUTCString(), "Ban", moderatorBan, banReason])
                                    writer.end()
                                    console.log("● Successfully wrote ban for user '" + member.displayName + "' to CSV file.")
                                    
                                    var msg = banMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorBan + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = banReason + "\n";
                                    embed.addField("**Reason**", msg);
                                    
                                    banMember.ban(7);
                                    message.channel.send(":white_check_mark: " + banMember.displayName + " was successfully banned.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    warnMember = null;
                                });
                            }
                            message.delete();
                            break;
                            } else {
                            return;
                        }
                    case "softban":
                    doNotDelete = true;
                        if (commandBan == "on") {
                            if (banMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to softban. See mod:help for more information.');

                            } else {
                                message.guild.fetchMember(banMember).then(function(member) {
                                    embed = new Discord.RichEmbed("softban");
                                    embed.setAuthor("ꜱᴏꜰᴛʙᴀɴ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#af1c1c");

                                    //begin attempt at csv write
                                    var writer = csvWriter({ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"], sendHeaders:false}) //{ headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "No. of Warnings", "Punished by", "Reason"]}
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {flags: 'a'}))
                                    writer.write([member.displayName + "#" + member.user.discriminator, message.createdAt.toUTCString(), "Softban", moderatorBan, banReason])
                                    writer.end()
                                    console.log("● Successfully wrote softban for user '" + member.displayName + "' to CSV file.")
                                    
                                    var msg = banMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorBan + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = banReason + "\n";
                                    embed.addField("**Reason**", msg);
                                    
                                    message.guild.ban(banMember, 7);
                                    message.guild.unban(banMember);
                                    message.channel.send(":white_check_mark: " + banMember.displayName + " was successfully softbanned.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    warnMember = null;
                                });
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "reboot":
                    doNotDelete = true;
                        message.channel.send(":white_check_mark: We'll be back in a bit.").then(function() {
                            client.destroy();
                            client.login('MzAwNTUyMzc0MDg1MjIyNDAw.C8udkQ.WqOWKPikEVT6cdSeGMuyf2Khe3I').then(function() {
                                message.channel.send(":white_check_mark: XailBot is back online!");
                            }).catch(function() {
                                console.log("▲ [ERROR] Login failed.");
                            });
                        });
                        break;
                    case "help":
                    doNotDelete = true;
                        if (commandHelp == "on") {
                            var helpMessage = "And here are the mod only commands:\n```\n" +
                                "* mod [on|off]    		   Queries moderation status.\n";

                            helpMessage = helpMessage +
                                "* filter [on|off]   		Queries the chat filter.\n";

                            helpMessage = helpMessage +
                                "rm [number]       		Deletes a number of messages.\n" +
                                "uinfo [user]      		Gets information about a user. You must tag the user\n" +
                                "                  		in order to see their information.\n" +
                                "warn [user] [reason]      Give a warning to a user.\n" +
                                "ban [user] [reason]       Ban someone from the server.\n" +
                                "say [message]	   	  Say something under the bot's name.\n" +
                                "setgame [game]			Set what the bot is playing to whatever you want.\n" +
                                "* panic     		    Toggles panic mode.\n" +
                                "deletemessages    		Automatically removes bot messages after 10 seconds.\n" +
                                "cancel            		Cancels a pending operation.\n" +
                                "help              		Prints this help message.\n" +
                                "reboot            		Asks XailBot to reconnect.\n" +
                                "\n" +
                                "* = denotes an admin only command\n" +
                                "These commands need to be prefixed with mod:\n" +
                                "```";
                            message.delete();
                            message.channel.send(helpMessage);
                            break;
                        } else {
                            return;
                        }
                    case "cancel":
                    doNotDelete = false;
                        if (commandCancel == "on") {
                            if (poweroff) {
                                poweroff = false;
                                message.channel.send(':white_check_mark: **OK**, I won\'t leave... yet.')
                            } else if (warnMember != null) {
                                message.channel.send(':white_check_mark: **OK**, I won\'t warn ' + warnMember.displayName);
                                warnMember = null;
                            } else if (banMember != null) {
                                message.channel.send(':white_check_mark: **OK**, I won\'t ban ' + banMember.displayName);
                                banMember = null;
                            } else {
                                message.reply(':no_entry_sign: **ERROR:** Nothing to cancel.');
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    default:

                        if (command.startsWith("uinfo") && commandUinfo == "on") {
                            doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "");

                            message.guild.fetchMember(command).then(function(member) {
                                embed = new Discord.RichEmbed("test");
                                embed.setAuthor(member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                embed.setColor("#FF0000");
                                embed.setDescription("User Information");

                                {
                                    var msg = "**Created** " + member.user.createdAt.toUTCString() + "\n";
                                    if (member.joinedAt.getTime() == 0) {
                                        msg += "**Joined** -∞... and beyond! Discord seems to be giving incorrect info... :(";
                                    } else {
                                        msg += "**Joined** " + member.joinedAt.toUTCString();
                                    }

                                    embed.addField("Timestamps", msg);
                                }

                                {
                                    var msg = "**Current Display Name** " + member.displayName + "\n";
                                    msg += "**Username** " + member.user.username + "\n";
                                    if (member.nickname != null) {
                                        msg += "**Nickname** " + member.nickname;
                                    } else {
                                        msg += "**Nickname** No nickname";
                                    }

                                    embed.addField("Names", msg);
                                }

                                /*if (member.lastMessageID != null) {
                                    var lastMessage = null;
                                    
                                    message.channel.fetchMessage(member.lastMessage).then(function(retrievedMessage) {
                                        lastMessage = retrievedMessage;
                                    }).catch(function () {
                                        lastMessage = -1;
                                    });
                                    
                                    while (lastMessage == null) {}
                                    
                                    if (lastMessage != -1) {
                                        var msg = "**ID** " + member.lastMessageID + "\n";
                                        msg += "**Contents** " + lastMessage.content;
                                        
                                        embed.addField("Last Message", msg);
                                    }
                                }*/

                                embed.setFooter("User ID: " + member.user.id);
                                //embed.setDescription(msg);
                                message.channel.sendEmbed(embed);

                                lastUserInteraction[message.guild.id] = command;
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 3) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
                                }
                            });
                        } else if (command.startsWith("warn") && commandWarn == "on") {
                            doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //begin attempt at reason
                            var reason = "";
                            var args = {};
                            var warning = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (var i = 0; i < arrayLength; i++) {
                                    warning = (warning + argsArray[i] + " ");
                                }
                                warning = warning.replace(argsArray[0], "");
                                warning = warning.trim();
                                warnReason = warning;
                            }

                            message.guild.fetchMember(command).then(function(member) {
                                warnMember = member;
                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You can\'t warn other moderators.');
                                } else {
                                    if (warning == ("")) {
                                        message.reply(':no_entry_sign: **NOPE:** You are warning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are giving the warning.');
                                    } else {

                                        moderatorWarn = message.author;

                                        message.reply(':oncoming_police_car: You are about to warn **' + member.displayName + '** for *' + warning + '*. To confirm, type in `mod:warn`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 3) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
                                }
                            });
                            message.delete();
                        } else if (command.startsWith("ban") && commandBan == "on") {
                            doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //begin attempt at reason
                            var ban = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (var i = 0; i < arrayLength; i++) {
                                    ban = (ban + argsArray[i] + " ");
                                }
                                ban = ban.replace(argsArray[0], "");
                                ban = ban.trim();
                                banReason = ban;
                            }

                            message.guild.fetchMember(command).then(function(member) {
                                banMember = member;
                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You can\'t ban other moderators.');
                                } else {
                                    if (ban == ("")) {
                                        message.reply(':no_entry_sign: **NOPE:** You are banning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are banning them.');
                                    } else {

                                        moderatorBan = message.author;

                                        message.reply(':oncoming_police_car: You are about to ban **' + member.displayName + '** for *' + ban + '*.\n:no_entry: **Bans are only meant to be issued under serious circumstances, and if used incorrectly will lead to consequences.**\nTo confirm, type in `mod:ban`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 3) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
                                }
                            });
                            message.delete();
                        } else if (command.startsWith("softban") && commandBan == "on") {
                            doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //begin attempt at reason
                            var ban = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (var i = 0; i < arrayLength; i++) {
                                    ban = (ban + argsArray[i] + " ");
                                }
                                ban = ban.replace(argsArray[0], "");
                                ban = ban.trim();
                                banReason = ban;
                            }

                            message.guild.fetchMember(command).then(function(member) {
                                banMember = member;
                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You can\'t ban other moderators.');
                                } else {
                                    if (ban == ("")) {
                                        message.reply(':no_entry_sign: **NOPE:** You are softbanning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are banning them.');
                                    } else {

                                        moderatorBan = message.author;

                                        message.reply(':oncoming_police_car: You are about to softban **' + member.displayName + '** for *' + ban + '*.\n:no_entry: **This will ban the user and immediately un-ban them.**\nTo confirm, type in `mod:softban`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 3) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
                                }
                            });
                            message.delete();
                        } else if (command.startsWith("rm") && commandRm == "on") {
                            doNotDelete = false;
                            command = command.substr(3);
                            var num = parseInt(command);

                            if (num != command) {
                                message.channel.send(":no_entry_sign: **ERROR:** That's not a number...");
                            } else {
                                num = num + 1; //Also remove the mod:rm command
                                message.channel.bulkDelete(num).then(function() {

                                    message.channel.send(":white_check_mark: **OK:** I successfully deleted " + command + " messages.");
                                    numDel = parseInt(num - 1);
                                }).catch(function() {
                                    switch (Math.floor(Math.random() * 1000) % 3) {
                                        case 0:
                                            message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                            break;
                                        case 1:
                                            message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                            break;
                                        case 2:
                                            message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                            break;
                                    }
                                });
                            }
                        } else if (command.startsWith("say") && commandSay == "on") {
                            command = command.substr(4);
                            doNotDelete = true;
                            var messagesay = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 0) {
                                for (var i = 0; i < arrayLength; i++) {
                                    messagesay = (messagesay + argsArray[i] + " ");
                                }
                                messagesay = messagesay.trim();
                            }

                            message.channel.send(":warning: " + messagesay);
                            message.delete();

                        } else if (command.startsWith("poll") && commandSay == "on") {
                            command = command.substr(4);
                            doNotDelete = true;
                            var pollm = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 0) {
                                for (var i = 0; i < arrayLength; i++) {
                                    pollm = (pollm + argsArray[i] + " ");
                                }
                                pollm = pollm.trim();
                            }
                            message.delete();
                            message.channel.send(":information_source: A poll has just been created! \n" + ":writing_hand: **" + pollm + "**\n:white_check_mark: Cast your votes to the poll by using reactions on this message!");

                       // } else if (command.startsWith("endpoll")) {
                       //     console.log(messageReact.emoji);           
                            
                       //     var pollm = "";
                       //     var argsArray = messageReact.emoji;
                       //     var arrayLength = 1;

                       //     message.channel.send(":information_source: Here are the results:");
                            
                       //     if (arrayLength > 0) {
                       //         for (var i = 0; i < arrayLength; i++) {
                       //             message.channel.send(messageReact.emoji.name + " - " + messageReact.count);
                       //         }
                       //     }

                       //     message.channel.send(messageReact.emoji.name + " - " + messageReact.count);

                       //     console.log("▲ Poll has ended.");
                       //     message.delete();
                            
                        } else if (command.startsWith("setgame") && commandSetgame == "on") {
                            doNotDelete = true;
                            command = command.substr(6);

                            var gamemessage = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;
                            var presence = {};
                            presence.game = {};
                            presence.status = "online";
                            presence.afk = false;

                            if (arrayLength > 0) {
                                for (var i = 0; i < arrayLength; i++) {
                                    gamemessage = (gamemessage + argsArray[i] + " ");
                                }
                                gamemessage = gamemessage.trim();
                            }
                            message.guild.fetchMember(message.author).then(function(member) {

                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You don\'t have access to this command.');
                                } else {
                                    presence.game.name = gamemessage;
                                    client.user.setPresence(presence);
                                    message.delete()
                                    message.channel.send(":white_check_mark: **OK:** I successfully set the game to **" + gamemessage + "**. It may take a few seconds to register this change.\n:information_source: Please note that this change is only temporary, as after a while the game will automatically be overwritten by something else.");
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 3) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
                                }
                            });
                        }
   
                        
                        if (command == "poweroff") {
                            doNotDelete = true;
                            if (message.author.id == 196792235654774784 || message.author.id == 246574843460321291) {
                                if (poweroff) {
                                    switch (Math.floor(Math.random() * 1000) % 3) {
                                        case 0:
                                            message.channel.send(':white_check_mark: XailBot is now exiting. Goodbye!').then(function() {
                                                process.exit(0);
                                            }).catch(function() {
                                                process.exit(0);
                                            });
                                            break;
                                        case 1:
                                            message.channel.send(':white_check_mark: See you next time!').then(function() {
                                                process.exit(0);
                                            }).catch(function() {
                                                process.exit(0);
                                            });
                                            break;
                                        case 2:
                                            message.channel.send(':white_check_mark: They saw... right through me...').then(function() {
                                                process.exit(0);
                                            }).catch(function() {
                                                process.exit(0);
                                            });
                                            break;
                                    }
                                } else {
                                    message.channel.send(':information_source: You are about to shut down any instance of Xail Bot. Are you sure you want to do this?');
                                    poweroff = true;
                                }
                            } else {
                                doNotDelete = false;
                                message.reply(':no_entry_sign: **NOPE:** Only administrators are allowed to power off the bot.');
                            }
                        } else {
                            poweroff = false;
                        }
                }
            } else {
                doNotDelete = false;
                message.reply(':no_entry_sign: **NOPE:** What? You\'re not a member of the staff! Why would you be allowed to type that!?');
                message.delete();
            }
        }

        if (doModeration[message.guild.id]) { //Check if we should do moderation on this server
            //Spam limiting
            if (lastMessages[message.author.id] != msg) {
                sameMessageCount[message.author.id] = 0;
            }
            lastMessages[message.author.id] = msg
            sameMessageCount[message.author.id] += 1;

            if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] == 5) {
                var auth = message.author;
                if (message.guild.id == 300575580116746240) { //AstralPhaser
                    client.channels.get("300585564279799808").sendMessage(getBoshyTime(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
                }
                doNotDelete = false;
                message.reply("Quite enough of this. I'm not warning you any more. A notification has been sent to the mods.");
                message.delete();
            } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 5) {
                message.delete();
            } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 3) {
                doNotDelete = false;
                console.log("▲ Spam limits kicking in!");
                switch (Math.floor(Math.random() * 1000) % 5) {
                    case 0:
                        message.reply("Well... We all heard you.");
                        break;
                    case 1:
                        message.reply("Stop typing the same thing! You're like a broken record!");
                        break;
                    case 2:
                        message.reply("Hmm... Not sure if you'd actually say the same thing more than three times in public.");
                        break;
                    case 3:
                        message.reply("Is that the only phrase you know? Can you try typing something else?");
                        break;
                    case 4:
                        message.reply("Pollution is not the solution, my friend.");
                        break;
                }

                message.delete();
            } else if (smallMessageCount[message.author.id] == 6) {
                var auth = message.author;
                if (message.guild.id == 300575580116746240) { //test server
                    client.channels.get("300585564279799808").sendMessage(getBoshyTime(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");

                }
                doNotDelete = false;
                message.reply("Quite enough of this. I'm not warning you any more. A notification has been sent to the mods.");
                message.delete();
            } else if (smallMessageCount[message.author.id] > 6) {
                message.delete();
            } else if (smallMessageCount[message.author.id] > 5) {
                console.log("▲ Spam limits kicking in!");
                doNotDelete = false;
                switch (Math.floor(Math.random() * 1000) % 4) {
                    case 0:
                        message.reply("This looks like spam. And we don't like spam.");
                        break;
                    case 1:
                        message.reply("Cut it out.");
                        break;
                    case 2:
                        message.reply("Very... scribbly...");
                        break;
                    case 3:
                        message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
                        break;
                }

                message.delete();
            }
        }
    }
}



client.on('message', messageChecker);
client.on('messageUpdate', messageChecker);

client.on('guildMemberAdd', function(guildMember) {
    if (guildMember.guild.id == 300575580116746240) {
        var channel;
        channel = client.channels.get("300585564279799808");

        embed = new Discord.RichEmbed("info");
        embed.setAuthor("ᴜꜱᴇʀ ᴊᴏɪɴᴇᴅ » " + guildMember.displayName, guildMember.user.displayAvatarURL);
        embed.setColor("#30b236");
        
        var msg = guildMember.user.discriminator + "\n"
        embed.addField("**Discriminator**", "#" + msg);
        
        var msg = guildMember.user.createdAt.toUTCString() + "\n";
        embed.addField("**User Created**", msg);
        
        if (guildMember.joinedAt.toUTCString() == "Thu, 01 Jan 1970 00:00:00 GMT") {
            msg = "Joined at: -∞... and beyond! Discord seems to be giving incorrect info... :(";
        } else {
            msg = guildMember.joinedAt.toUTCString();
        }
        embed.addField("**User Joined**", msg);
        client.channels.get("300585564279799808").sendEmbed(embed);

    }
});

client.on('guildMemberUpdate', function(oldUser, newUser) {

    if (newUser.nickname != oldUser.nickname) {
        var channel = client.channels.get("300585564279799808"); //Admin Bot warnings
        if (newUser.nickname == null) {
            embed = new Discord.RichEmbed("warning");
            embed.setAuthor("ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
            embed.setDescription(oldUser.user.username + " has cleared their nickname.\nIt has now defaulted to their username.");
            embed.setColor("#42b3f4");

            var msg = oldUser.displayName + "\n";
            embed.addField("**Previous Name**", msg);


            client.channels.get("300585564279799808").sendEmbed(embed);
        } else {
            embed = new Discord.RichEmbed("warning");
            embed.setAuthor("ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
            embed.setColor("#42b3f4");

            var msg = oldUser.displayName + "\n";
            embed.addField("**Previous Name**", msg);

            var msg = newUser.nickname + "\n";
            embed.addField("**New Nickname**", msg);

            client.channels.get("300585564279799808").sendEmbed(embed);
        }
    }
});

client.on('userUpdate', function(oldUser, newUser) {
    if (newUser.guild != null) {
        if (newUser.guild.id == 300575580116746240) {
            if (newUser.username != oldUser.username) {
                var channel = client.channels.get("300585564279799808"); //Admin Bot warnings
                embed = new Discord.RichEmbed("warning");
                embed.setAuthor("ᴜsᴇʀɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
                embed.setColor("#3698d1");

                var msg = oldUser.user.username + "\n";
                embed.addField("**Previous Username**", msg);

                var msg = newUser.user.username + "\n";
                embed.addField("**New Username**", msg);

                client.channels.get("300585564279799808").sendEmbed(embed);
            }
        }
    }
});

client.on('messageDelete', function(message) {
    if (message.content.startsWith("bot:") || message.content.startsWith("mod:")) return; //Don't want to warn about AstralMod deleted messages
    var channel = null;

    if (message.guild != null) {
        if (panicMode[message.guild.id]) return; //Don't want to be doing this in panic mode!
        if (botDelMessage[message.guild.id]) return;

        if (message.guild.id == 300575580116746240) { //General chat for testbot
            channel = client.channels.get("300585564279799808");
        }


        if (channel != null) {
            channel.sendMessage(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> at " + message.createdAt.toUTCString() + " was deleted.\n" +
                "```\n" +
                message.cleanContent + "\n" +
                "```"
            );
        }
    }
});

client.on('messageDeleteBulk', function(messages) {
    var channel = null;

    if (panicMode[messages.first().guild.id]) return; //Don't want to be doing this in panic mode!
    if (botDelMessage[messages.first().guild.id]) return;

    channel = client.channels.get("300585564279799808");

    if (channel != null) {
        console.log("▲ " + numDel + " messages deleted using mod:rm.");
    }

});

client.on('messageUpdate', function(oldMessage, newMessage) {
    if (oldMessage.cleanContent == newMessage.cleanContent) return; //Ignore
    var channel = null;
    if (oldMessage.guild != null) {
        if (oldMessage.guild.id == 300575580116746240) { //AstralPhaser Central
            channel = client.channels.get("300585564279799808");
        }

        if (channel != null) {
            channel.sendMessage(":pencil2: Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> at " + oldMessage.createdAt.toUTCString() + " was edited.\n" +
                "**Original Content** ```\n" +
                oldMessage.cleanContent + "\n" +
                "```" +
                "**Edited Content** ```\n" +
                newMessage.cleanContent + "\n" +
                "```\n"
            );
        }
    }
});