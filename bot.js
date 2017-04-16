/****************************************
 * 
 *   XailBot: Moderation bot designed for Rainbow Gaming.
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *	 Rewritten by zBlake
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
const api = require('./keys.js');
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
var warnMember = null;
var banMember = null;
var numDel;
var botDelMessage = {};
var warnReason = {};
var banReason = {};
var moderatorWarn = {};
var moderatorBan = {};
var doNotDelete = {};
var muteMember = null;
var moderatorMute = {};
var muteReason = {};
var warningCount = 0;

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
console.log('● You can change these settings as you want in "settings.txt".');

rl.on('line', function(line) {
    console.log("» " + line);
    if (line.includes("mod:on")) {
        commandMod = "on"
    } else if (line.includes("filter:on")) {
        commandFilter = "on"
    } else if (line.includes("rm:on")) {
        commandRm = "on"
    } else if (line.includes("uinfo:on")) {
        commandUinfo = "on"
    } else if (line.includes("warn:on")) {
        commandWarn = "on"
    } else if (line.includes("ban:on")) {
        commandBan = "on"
    } else if (line.includes("say:on")) {
        commandSay = "on"
    } else if (line.includes("setgame:on")) {
        commandSetgame = "on"
    } else if (line.includes("panic:on")) {
        commandPanic = "on"
    } else if (line.includes("cancel:on")) {
        commandCancel = "on"
    } else if (line.includes("help:on")) {
        commandHelp = "on"
    }
});

function setGame() {
    var presence = {};
    presence.game = {};
    presence.status = "online";
    presence.afk = false;


    switch (Math.floor(Math.random() * 1000) % 22) {
        case 0:
            presence.game.name = "with various buttons";
            break;
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
            presence.game.name = "with other bots";
            break;
        case 15:
            presence.game.name = "Pokèmon";
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

client.login(api.key()).catch(function() {
    console.log("[ERROR] Login failed.");
    console.log(api.key);
});

client.on('ready', () => {

    console.log(" ");
    console.log(" ");
    console.log("● XailBot is ready!");
    console.log(" ");
    console.log(" ");
    client.setInterval(setGame, 300000);
    setGame();
    doModeration[300575580116746240] = true;
});


//var WebSocket = require('ws');
//var ws = new WebSocket('ws://localhost:3337/');
//ws.on('open', function() {
//   console.log('sending API registration');
//    ws.send('api|register|EE3A7DJQOMKJFBBHGPdZafNWKbTIHBBadQECT');
//});
//
//ws.on('close', function close() {
//  console.log('disconnected');
//});
//ws.on('message', function(message) {
//    console.log('Received: ' + message);
//});

//Commented out for later use

function warningIcon(guild) {
    return ":warning:";
}

//var prank = true;
//IT'S JUST A PRANK BRO

function reactionChecker(messageReaction, user) { // this function is never called
    if (messageReaction.message.author.id == 303017211457568778 && messageReaction.message.content.includes("poll") && messageReaction.message.content.includes("created")) {
        messageReact = messageReaction;
    }

}

function aestTime() {
    var localtime = new Date();
    
    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
    var dateString = date.toString();
    
    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));  
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
        if (message.author.id == 303017211457568778 && doNotDelete == false) {
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


    if (message.author.id != 280495817901473793 && !message.author.bot) {
        if (doModeration[message.guild.id]) { //Check if we should do moderation on this server
            if ((expletiveFilter && message.guild.id == 300575580116746240)) {
                //Check for expletives
                var exp = msg.search(/(\b|\s|^|\.|\,|\ )(shit|shite|shitty|bullshit|fuck|fucking|ass|penis|cunt|faggot|fark|fck|fag|wank|wanker|nigger|nigga|bastard|bitch|asshole|dick|d1ck|b1tch|b!tch|blowjob|cock|nigg|fuk|cnut|pussy|c0ck|retard|stfu|porn)(\b|\s|$|\.|\,|\ )/i);
                if (exp != -1) { //Gah! They're not supposed to say that!
                    console.log("▲ Expletive caught at " + parseInt(exp));
                    switch (Math.floor(Math.random() * 1000) % 21) {
                        case 0:
                            message.reply("I'm very disappointed in you. :angry:");
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
						case 7:
                            message.reply("Hey! Just cool it.");
                            break;
						case 8:
                            message.reply("Watch your mouth.");
                            break;
						case 9:
                            message.reply("I can't believe you've done this...");
                            break;
						case 10:
                            message.reply("Did you have to say that?");
                            break;
						case 11:
                            message.reply("You can't say that man!");
                            break;
						case 12:
                            message.reply("You've triggered me!");
                            break;
						case 13:
                            message.reply("Woah! Calm down buddy!");
                            break;
						case 14:
                            message.reply("Won't somebody please just think about the children?");
                            break;
						case 15:
                            message.reply("Was that necessary?");
                            break;
						case 16:
                            message.reply("I think you might need to have a quick look at the rules again.");
                            break;
						case 17:
                            message.reply("Gah! You can't say that!");
                            break;
						case 18:
                            message.reply("You can't use those words here.");
                            break;
						case 19:
                            message.reply("Get some soap, and wash your mouth out.");
                            break;
						case 20:
                            message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
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
                        switch (Math.floor(Math.random() * 1000) % 11) {
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
							case 6:
                                message.reply("I think your CAPS LOCK might be stuck.");
                                break;
							case 7:
                                message.reply("WHY ARE YOU SHOUTING");
                                break;
							case 8:
                                message.reply("Hey! Inside voice please.");
                                break;
							case 9:
                                message.reply("Have you tried turning off CAPS LOCK?");
                                break;
							case 10:
                                message.reply("Writing your message in caps won't make it better.");
                                break;
                        }
                        doNotDelete = false;
                        message.delete();
                        return;
                    }
                }
            }
        }

        
        if (message.author.id != 303017211457568778 && msg.search(/\b(kys|kill yourself)\b/i) != -1) {
                var auth = message.author;
                if (message.guild.id == 277922530973581312) { //AstralPhaser
                    client.channels.get("300585564279799808").sendMessage(warningIcon(message.guild) + " **KYS:** <@" + auth.id + "> wrote \"kill yourself\" in " + message.channel.name + ".");
                }
                message.reply("Right. We don't appreciate that here. A notification has been sent to the mods.");
                message.delete();
            }
        
        
        
        if (message.mentions != null && message.mentions.users != null) {
            doNotDelete = true;
            if (message.mentions.users.has("303017211457568778")) {
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
                    } else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("=")) {
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

        var commandProcessed = false;
        if (msg.toLowerCase().startsWith("mod:") || msg.toLowerCase().startsWith("bot:")) {
            var command = msg.substr(4);
            switch (command) {
                case "ping":
                    doNotDelete = true;
                    switch (Math.floor(Math.random() * 1000) % 5) {
                        case 0:
                            message.channel.send(warningIcon(message.guild) + ' **PONG!** I want to play pong too... :\'(');
                            break;
                        case 1:
                            message.channel.send(warningIcon(message.guild) + ' **PONG!** I love playing pong!');
                            break;
                        case 2:
                            message.channel.send(warningIcon(message.guild) + ' **PONG!** Thanks for playing pong with me!');
                            break;
                        case 3:
                            message.channel.send(warningIcon(message.guild) + ' **PONG!** Reflect upon this!');
                            break;
                        case 4:
                            message.channel.send(warningIcon(message.guild) + ' **PONG!**');
                            break;
                    }
                    commandProcessed = true;
                    break;
                case "pong":
                    doNotDelete = true;
                    switch (Math.floor(Math.random() * 1000) % 5) {
                        case 0:
                            message.channel.send(warningIcon(message.guild) + ' **PING!** Pings are also cool!');
                            break;
                        case 1:
                            message.channel.send(warningIcon(message.guild) + ' **PING!** Do you like playing pong?');
                            break;
                        case 2:
                            message.channel.send(warningIcon(message.guild) + ' **PING!** Here\'s the test message you wanted!');
                            break;
                        case 3:
                            message.channel.send(warningIcon(message.guild) + ' **PING!** Don\'t breathe this!');
                            break;
                        case 4:
                            message.channel.send(warningIcon(message.guild) + ' **PING!**');
                            break;
                    }
                    commandProcessed = true;
                    break;
                case "time":
                    var localtime = new Date();
                    
                    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
                    var dateString = date.toString();
                    
                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));
                    message.channel.send(':arrow_forward: The time now is ' + dateString);
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
            }
        }

        if (msg.toLowerCase().startsWith("mod:") && !commandProcessed) {
            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                var command = msg.substr(4);
                switch (command) {
                    case "filter":
                        doNotDelete = false;
                        if (commandFilter == "on") {
                            if (message.guild.id != 300575580116746240) {
                                message.reply(':no_entry_sign: ERROR: Unable to use that command in this server.');
                            } else {
                                if (expletiveFilter) {
                                    message.channel.send(':arrow_forward: **Expletive Filter:** *on*');
                                } else {
                                    message.channel.send(':arrow_forward: **Expletive Filter:** *off*');
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
                                message.channel.send(':arrow_forward: **Moderation:** *on*');
                            } else {
                                message.channel.send(':arrow_forward: **Moderation:** *off*');
                            }
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                        //Test command for joining voice channels. Used for testing features with voice chat, only temporary command.
                    case "random":
                        doNotDelete = false;
                        var channel = client.channels.get("300575580116746241");
                        channel.join()
                            .then(connection => {
                                const dispatcher = connection.playFile('./nope.wav', {
                                    volume: 0.6
                                });
                            })
                            .then(dispatcher => {
                                dispatcher.on('end', () => {
                                    message.channel.send("Song finished.");
                                });
                                dispatcher.on('error', console.error);
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
                    case "mute":
                        doNotDelete = true;
                        if (commandWarn == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                             if (muteMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to mute. See mod:help for more information.');
                            } else {
                                message.guild.fetchMember(muteMember).then(function(member) {
                                    embed = new Discord.RichEmbed("mute");
                                    embed.setAuthor("ᴍᴜᴛᴇ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#E5C01D");

                                    var localtime = new Date();
                    
                                    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
                                    var dateString = date.toString();
                    
                                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));                                    
                                    
                                    //Write mute information to .csv file
                                    var writer = csvWriter({
                                        headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"],
                                        sendHeaders: false
                                    })
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                                        flags: 'a'
                                    }))
                                    writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Mute", moderatorMute.username, muteReason])
                                    writer.end()
                                    console.log("● Successfully wrote mute for user '" + member.displayName + "' to CSV file.")

                                    var msg = muteMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorMute + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = muteReason + "\n";
                                    embed.addField("**Reason**", msg);

                                    muteMember.addRole(muteMember.guild.roles.get("302285092036935680"));
                                    muteMember.setVoiceChannel(muteMember.guild.channels.get(muteMember.guild.afkChannelID));

                                    message.channel.send(":white_check_mark: " + muteMember.displayName + " was succesfully muted.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    muteMember = null;
                                });
                            }    
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                           
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "warn":
                        doNotDelete = true;
                        if (commandWarn == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                             if (warnMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to warn. See mod:help for more information.');
                            } else {
                                message.guild.fetchMember(warnMember).then(function(member) {

                                    var localtime = new Date();
                    
                                    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
                                    var dateString = date.toString();
                    
                                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));                                
                                
                                    //Write warning information to .csv file
                                    var writer = csvWriter({
                                        headers: ["Discord Username", "Date (in GMT)", "Type of Punishment", "Punished by", "Reason"],
                                        sendHeaders: false
                                    })
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                                        flags: 'a'
                                    }))
                                    writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Warning", moderatorWarn.username, warnReason])
                                    writer.end()
                                    console.log("● Successfully wrote warning for user '" + member.displayName + "' to CSV file.")


                                    embed = new Discord.RichEmbed("warning");
                                    embed.setAuthor("ᴡᴀʀɴɪɴɢ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#E5C01D");

                                    var msg = warnMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorWarn + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = warnReason + "\n";
                                    embed.addField("**Reason**", msg);

                                    var msg = warningCount + 1 + "\n"; // Add 1 to warningCount to include this warning as well.
                                    embed.addField("**Warning #**", msg);

                                    message.channel.send(":white_check_mark: " + warnMember.displayName + " was successfully warned.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    warningCount = 0;
                                    warnMember = null;
                                });
                            }
                            } else {
                                message.reply(":no_entry_sign: **NOPE:** You don't have access to this command.");
                            }
                           
                            message.delete();
                            break;
                        } else {
                            return;
                        }


                    case "ban":
                        doNotDelete = true;
                        if (commandBan == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                            if (banMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to ban. See mod:help for more information.');

                            } else {
                                message.guild.fetchMember(banMember).then(function(member) {
                                    embed = new Discord.RichEmbed("ban");
                                    embed.setAuthor("ʙᴀɴ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#af1c1c");

                                    var localtime = new Date();
                    
                                    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
                                    var dateString = date.toString();
                    
                                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));                                    
                                    
                                    //Write ban information to .csv file
                                    var writer = csvWriter({
                                        headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"],
                                        sendHeaders: false
                                    })
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                                        flags: 'a'
                                    }))
                                    writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Ban", moderatorBan, banReason])
                                    writer.end()
                                    console.log("● Successfully wrote ban for user '" + member.displayName + "' to CSV file.")

                                    var msg = banMember + "\n";
                                    embed.addField("**User**", msg);

                                    var msg = moderatorBan + "\n";
                                    embed.addField("**Moderator**", msg);

                                    var msg = banReason + "\n";
                                    embed.addField("**Reason**", msg);

                                    message.guild.ban(banMember, 7);
                                    message.channel.send(":white_check_mark: " + banMember.displayName + " was successfully banned.");
                                    client.channels.get("300585564279799808").sendEmbed(embed);
                                    warnMember = null;
                                });
                            }    
                            } else {
                                message.reply(":no_entry_sign: **NOPE:** You don't have access to this command.");
                            }                            
                            
                            message.delete();
                            break;
                        } else {
                            return;
                        }
                    case "softban":
                        doNotDelete = true;
                        if (commandBan == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                            if (banMember == null) {
                                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to softban. See mod:help for more information.');

                            } else {
                                message.guild.fetchMember(banMember).then(function(member) {
                                    embed = new Discord.RichEmbed("softban");
                                    embed.setAuthor("ꜱᴏꜰᴛʙᴀɴ »  " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                    embed.setColor("#e08743");

                                    var localtime = new Date();
                    
                                    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
                                    var dateString = date.toString();
                    
                                    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));
                                    
                                    //Write softban information to .csv file
                                    var writer = csvWriter({
                                        headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"],
                                        sendHeaders: false
                                    })
                                    writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                                        flags: 'a'
                                    }))
                                    writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Softban", moderatorBan, banReason])
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
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
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
                            client.login(api.key()).then(function() {
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
                            } else if (muteMember != null) {
                                message.channel.send(':white_check_mark: **OK**, I won\'t mute ' + muteMember.displayName);
                                muteMember = null;
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
                                embed.setAuthor("ᴜꜱᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ » " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
                                embed.setColor("#c64ed3");

                                {
                                    var msg = "**Created** » " + member.user.createdAt.toUTCString() + "\n";
                                    if (member.joinedAt.getTime() == 0) {
                                        msg += "**Joined** » -∞... and beyond! Discord seems to be giving incorrect info... :(";
                                    } else {
                                        msg += "**Joined** » " + member.joinedAt.toUTCString();
                                    }

                                    embed.addField("Timestamps", msg);
                                }

                                {
                                    var msg = "**Current Display Name** » " + member.displayName + "\n";
                                    msg += "**Username** » " + member.user.username + "\n";
                                    if (member.nickname != null) {
                                        msg += "**Nickname** » " + member.nickname;
                                    } else {
                                        msg += "**Nickname** » *This user has no nickname.*";
                                    }

                                    embed.addField("Names", msg);
                                }

                                embed.setFooter("User ID: " + member.user.id);
                                message.delete();
                                message.channel.sendEmbed(embed);
                                lastUserInteraction[message.guild.id] = command;
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            });
                        } else if (command.startsWith("warn") && commandWarn == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                                doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //Grab command and remove user argument to get reason
                            var warning = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (let i = 0; i < arrayLength; i++) {
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

                                        const rl = readline.createInterface({
                                            input: fs.createReadStream('./punishment tracker.csv')

                                            //Retrieve warning count info early so that it is ready to use when the user confirms the warn.

                                        });
                                        rl.on('line', function(line) {
                                            console.log("» " + line);
                                            if (line.includes("Warning") && line.includes(member.displayName + "#" + member.user.discriminator)) {
                                                warningCount = warningCount + 1
                                                console.log(warningCount);
                                            }
                                        });

                                        message.reply(':oncoming_police_car: You are about to warn **' + member.displayName + '** for *' + warning + '*. To confirm, type in `mod:warn`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            });
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                            
                            message.delete();

                        } else if (command.startsWith("mute") && commandWarn == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                               doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //Grab command and remove user argument to get reason
                            var mute = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (let i = 0; i < arrayLength; i++) {
                                    mute = (mute + argsArray[i] + " ");
                                }
                                mute = mute.replace(argsArray[0], "");
                                mute = mute.trim();
                                muteReason = mute;
                            }

                            message.guild.fetchMember(command).then(function(member) {
                                muteMember = member;
                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You can\'t mute other moderators.');
                                    return;
                                } 
                                if (member.roles.find("name", "Muted")) {
                                    message.reply(':no_entry_sign: **NOPE:** **' + member.displayName + '** is already muted.');
                                } else {
                                    if (mute == ("")) {
                                        message.reply(':no_entry_sign: **NOPE:** You are muting **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are muting them.');
                                    } else {

                                        moderatorMute = message.author;

                                        message.reply(':oncoming_police_car: You are about to mute **' + member.displayName + '** for *' + mute + '*.\n:no_entry: **This will prevent the user from talking in voice channels AND text channels.**\nTo confirm, type in `mod:mute`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            }); 
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                            
                            message.delete();
                        } else if (command.startsWith("ban") && commandBan == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                               doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //Grab command and remove user argument to get reason
                            var ban = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (let i = 0; i < arrayLength; i++) {
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
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            }); 
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                            
                            message.delete();
                        } else if (command.startsWith("softban") && commandBan == "on") {
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
                               doNotDelete = true;
                            command = command.substr(6);
                            command = command.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

                            //Grab command and remove user argument to get reason
                            var ban = "";
                            var argsArray = message.content.split(" ").slice(1);
                            var arrayLength = argsArray.length;

                            if (arrayLength > 1) {
                                for (let i = 0; i < arrayLength; i++) {
                                    ban = (ban + argsArray[i] + " ");
                                }
                                ban = ban.replace(argsArray[0], "");
                                ban = ban.trim();
                                banReason = ban;
                            }

                            message.guild.fetchMember(command).then(function(member) {
                                banMember = member;
                                if (member.roles.find("name", "Fleece Police")) {
                                    message.channel.send(':no_entry_sign: **ERROR:** You can\'t softban other moderators.');
                                } else {
                                    if (ban == ("")) {
                                        message.reply(':no_entry_sign: **NOPE:** You are softbanning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are going to softban them.');
                                    } else {

                                        moderatorBan = message.author;

                                        message.reply(':oncoming_police_car: You are about to softban **' + member.displayName + '** for *' + ban + '*.\n:no_entry: **This will ban the user and immediately un-ban them.**\nTo confirm, type in `mod:softban`.');
                                    }
                                }
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            }); 
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                            
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
                                }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
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
                                for (let i = 0; i < arrayLength; i++) {
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
                                for (let i = 0; i < arrayLength; i++) {
                                    pollm = (pollm + argsArray[i] + " ");
                                }
                                pollm = pollm.trim();
                            }
                            message.delete();
                            message.channel.send(":information_source: A poll has just been created! \n" + ":writing_hand: **" + pollm + "**\n:white_check_mark: Cast your votes to the poll by using reactions on this message!");

                            // Commented out to try and find solution.

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
                            if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
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
                                for (let i = 0; i < arrayLength; i++) {
                                    gamemessage = (gamemessage + argsArray[i] + " ");
                                }
                                gamemessage = gamemessage.trim();
                            }
                            message.guild.fetchMember(message.author).then(function(member) {

                                    presence.game.name = gamemessage;
                                    client.user.setPresence(presence);
                                    message.delete()
                                    message.channel.send(":white_check_mark: **OK:** I successfully set the game to **" + gamemessage + "**. It may take a few seconds to register this change.\n:information_source: Please note that this change is only temporary, as after a while the game will automatically be overwritten by something else.");
                            }).catch(function(reason) {
                                switch (Math.floor(Math.random() * 1000) % 4) {
                                    case 0:
                                        message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
                                        break;
                                    case 1:
                                        message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
                                        break;
                                    case 2:
                                        message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
                                        break;
									case 3:
                                        message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
                                        break;	
                                }
                            }); 
                            } else {
                               message.reply(":no_entry_sign: **NOPE:** You don't have access to this command."); 
                            }
                            
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
                                    message.channel.send(':information_source: You are about to shut down any instance of Xail Bot. To confirm this action, please type `mod:poweroff` again.');
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

            if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] == 7) {
                var auth = message.author;
                if (message.guild.id == 300575580116746240) { 
                    client.channels.get("300585564279799808").sendMessage(warningIcon(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
                }
                doNotDelete = false;
                message.reply("Quite enough of this. I'm not warning you any more. A notification has been sent to the mods.");
                message.delete();
            } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 7) {
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
                    client.channels.get("300585564279799808").sendMessage(warningIcon(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");

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

client.on('guildMemberRemove', function(guildMember) {
    if (guildMember.guild.id == 300575580116746240) {
        var channel;
        channel = client.channels.get("300585564279799808");

        embed = new Discord.RichEmbed("info");
        embed.setAuthor("ᴜꜱᴇʀ ʟᴇꜰᴛ » " + guildMember.displayName, guildMember.user.displayAvatarURL);
        embed.setColor("#d16c2e");

        var msg = guildMember.displayName + "#" + guildMember.user.discriminator + "\n"
        embed.addField("**Username**", "#" + msg);

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

    if (newUser.roles.find("name", "Muted")) {
        newUser.sendMessage(":warning: You have just been muted on Rainbow Gaming. Your ability to talk in voice/text channels has been revoked.");
        embed = new Discord.RichEmbed("mute");
        embed.setAuthor("ᴍᴜᴛᴇ »  " + newUser.displayName + "#" + newUser.user.discriminator, newUser.user.displayAvatarURL);
        embed.setColor("#E5C01D");
        var msg = muteReason + "\n";
        embed.addField("**Reason**", msg);

        var msg = new Date().toUTCString() + "\n";
        embed.addField("**Timestamp**", msg);

        newUser.sendEmbed(embed);
    }

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
    if (message.content.startsWith("bot:") || message.content.startsWith("mod:")) return;
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
        if (oldMessage.guild.id == 300575580116746240) {
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