const Discord = require("discord.js");
const events = require('events');
const colors = require('colors');
const { createCanvas, loadImage, registerFont, Image } = require('canvas')
const path = require('path');
const {
    promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
const Settings = require('./../general/Settings.js');
const Statistics = require('./Statistics.js');
const Permissions = require('./Permissions.js');
const Find = require('./Find.js')
const {Interface, zBotError} = require('./Interface.js');

const cooldowns = new Discord.Collection();
const count = new Discord.Collection();
const warned = new Discord.Collection();
var commandsUsed = {
    "total": 0,
    "specific": []
};
const BadgeStructure = require('./../user/Badges.js')

module.exports = class CommandHandler {
    /**
    * Handles errors, commands, aliases, permissions and cooldowns for commands.
    * @constructor
    * @param {Client} client - The discord.js Client to be passed through
    */
    constructor(client) {
        this.client = client;
    }

    /**
    * The function to run the command handler
    * @param {Message} message - The Message object to be passed through
    */
    async run(message) {
        const client = this.client;
        if (message.guild == null) return;
        if (message.author.bot) return;
        if (message.edits.length > 1) return;
        let prefix = await Settings.getValue(message.guild, "prefix")
        let moderatorRole = await Settings.getValue(message.guild, "moderatorRole")
        let adminRole = await Settings.getValue(message.guild, "adminRole")
        let deleteUserCommand = await Settings.getValue(message.guild, "deleteUserCommand")
        let developerOverrides = await Settings.doesDeveloperOverride();
        if (message.channel.type !== 'text') return;
        let msg = message.content;

        let member = message.member
        if (!member) member = message.guild.members.fetch(message.author.id);
        let profile = (await member.profile);

        if (!commandsUsed.hasOwnProperty(message.guild.id)) commandsUsed[message.guild.id] = {}, commandsUsed[message.guild.id].specific = [], commandsUsed[message.guild.id].total = 0;

        if (msg.toLowerCase().startsWith("<@" + client.user.id + ">")) prefix = "<@" + client.user.id + "> ";
        if (msg.toLowerCase().startsWith("<@!" + client.user.id + ">")) prefix = "<@!" + client.user.id + "> ";
        if (!msg.toLowerCase().startsWith(prefix)) return;
        let commandWithoutPrefix = msg.substr(prefix.length)
        let command = commandWithoutPrefix.split(" ")[0];
        let args = commandWithoutPrefix.split(" ").slice(1);
    
        /** Increments the command counter by one */
        function updateCommandTotal() {
            command = command.toString();
            commandsUsed[message.guild.id].total += 1;
            commandsUsed.total += 1;
            var objIndex = commandsUsed[message.guild.id].specific.findIndex((obj => obj.command == command));
            if (objIndex == -1) {
                commandsUsed[message.guild.id].specific.push({ "command": command, "count": 0 })
                objIndex = commandsUsed[message.guild.id].specific.findIndex((obj => obj.command == command));
            }
            commandsUsed[message.guild.id].specific[objIndex].count += 1
            var globalIndex = commandsUsed.specific.findIndex((obj => obj.command == command));
            if (globalIndex == -1) {
                commandsUsed.specific.push({ "command": command, "count": 0 })
                globalIndex = commandsUsed.specific.findIndex((obj => obj.command == command));
            }
            commandsUsed.specific[globalIndex].count += 1
        }


        /** Attempts to grab the category of the command that was requested to see if it is valid */
        let commandFile;
        if (client.commands.has(command)) {
            commandFile = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            commandFile = client.commands.get(client.aliases.get(command));
        }
        if (!commandFile) return;
        command = commandFile.settings.command;
        if ((await Settings.checkIgnore(message.guild, message.channel, "commands") || await Settings.checkDisable(message.guild, message.channel, command.toString())) 
        && (command.toString() !== "ignore") && (command.toString() !== "enable") && (command.toString() !== "disable")) return;
        

        //COOLDOWN SYSTEM
        if (!cooldowns.has(commandFile.settings.command)) cooldowns.set(commandFile.settings.command, new Discord.Collection());
        if (!count.has(commandFile.settings.command)) count.set(commandFile.settings.command, new Discord.Collection());
        const now = Date.now();
        const timestamps = cooldowns.get(commandFile.settings.command);
        const commandCount = count.get(commandFile.settings.command);
        const cooldownAmount = (commandFile.settings.throttle == undefined ? 5 : commandFile.settings.throttle.duration) * 1000;
        if (!commandCount.has(message.author.id)) {
            commandCount.set(message.author.id, 0)
            setTimeout(() => commandCount.delete(message.author.id), cooldownAmount);
        } else {
            let currentCount = commandCount.get(message.author.id)
            commandCount.set(message.author.id, currentCount + 1);

            if (!timestamps.has(message.author.id)) {
                timestamps.set(message.author.id, new Discord.Collection());
                timestamps.get(message.author.id).set("used", now);
                timestamps.get(message.author.id).set("warned", false);
                setTimeout(function(){ timestamps.delete(message.author.id); }, cooldownAmount);
            } else {
                const expirationTime = timestamps.get(message.author.id).get("used") + cooldownAmount;
                if (now < expirationTime && commandCount.get(message.author.id) >= (commandFile.settings.throttle == undefined ? 
                    4 : commandFile.settings.throttle.usages)) {
                    if (timestamps.get(message.author.id).get("warned")) return;
                    const timeLeft = (expirationTime - now) / 1000;
                    timestamps.get(message.author.id).set("warned", true);
                    return message.zreply(client.util.emoji("nope", message.guild) + ` You'll need to wait **${timeLeft.toFixed(1)} more second(s)** before you can use \`${commandFile.settings.command}\` again.`);
                }
            }
        }
        //END COOLDOWN

        /**
        * Ran when the command being executed is only usable by a specific role
        * @param {string} missingPermission - The permission that the user is missing in order to execute this command
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function insufficientPermissions(missingPermission, triedCommand) {
            return message.zreply(client.util.emoji("nope", message.guild) + ' You need the `' + missingPermission + '` permission to run `' + triedCommand + '`.');
        }

        /**
        * Ran when the command being executed is only usable by a specific role
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function wrongRole(role, triedCommand) {
            const roleS = message.guild.roles.get(role);
            if (!roleS) throw "Role not found"
            return message.zreply(client.util.emoji("nope", message.guild) + ' You need the `' + roleS.name + '` role to run `' + triedCommand + '`.');
        }

        /**
        * Ran when the command being executed is only usable in NSFW channels
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function nsfwCommand(triedCommand) {
            return message.zreply(client.util.emoji("nope", message.guild) + ' You need to be in an NSFW marked channel to run `' + triedCommand + '`.');
        }

        /**
        * Ran when the command being executed requires an upvote to use
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function needsUpvote(triedCommand) {
            return message.zreply(client.util.emoji("nope", message.guild) + ' You need to upvote zBot at **https://discordbots.org/bot/z/vote** to run `' + triedCommand + '`.');
        }

        /**
        * Ran when the command being executed is only able to be used by a specific user
        * @param {string} user - The user that is required to run this command
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function wrongUser(user, triedCommand) {
            return message.zreply(client.util.emoji("nope", message.guild) + ' Only `' + user.user.tag + '` can run `' + triedCommand + '`.');
        }

        /**
        * Ran when the command being executed is only usable by a developer of zBot
        * @param {string} triedCommand - The command that was attempted to be executed
        */
        function onlyDev(triedCommand) {
            return message.zreply(client.util.emoji("nope", message.guild) + ' Only zBot developers can run `' + triedCommand + '`.');
        }

        /** A function to perform special actions when a moderator command is executed */
        async function moderatorCommandExecuted() {
            //Grab the channels
            const channels = await Settings.grabLoggingChannels(message.guild, "moderation", "commands");
            if (!channels) return;

            const embed = new Discord.MessageEmbed();
            embed.setAuthor("Moderator Command Executed »  " + message.author.tag, (message.author.displayAvatarURL().toString().endsWith(".gif") ? message.author.displayAvatarURL() : message.author.displayAvatarURL({ size: 2048 })));
            embed.setColor("#455a64");
            embed.setDescription(client.util.emoji("info", message.guild) + " <@" + message.author.id + "> ran `" + command + "` in <#" + message.channel.id + ">.\n");
            let msg = "*No message provided*.";
            if (message.cleanContent.length > 1020) msg = message.cleanContent.substr(0, 1019) + "...";
            if (message.cleanContent.length < 1) msg = "*No message provided*.";
            msg = message.cleanContent;
            if (message.attachments.size > 0) msg += " " + message.attachments.map(a => a.attachment).toString();
            embed.addField("Full Command", msg);
            embed.setTimestamp(new Date());

            //Send the log to all the channel(s)
            for (let i in channels) {
              if (await Settings.checkIgnore(message.guild, channels[i], "logs")) continue;
              if (!message.guild.channels.has(channels[i])) continue;
              message.guild.channels.get(channels[i]).send({ embed });
            }
        }

        callCommand(client)

        /**
        * Calls a new command to be executed
        * @param {Client} client - A discord.js client to be passed through
        */
        async function callCommand(client) {
            if (commandFile.settings.permission == undefined) {
                return runCommand();
            }

            var discordPermission = (commandFile.settings.permission == undefined || typeof(commandFile.settings.permission) !== "object" ? "VIEW_CHANNEL" : commandFile.settings.permission.user);
            var commandPermission = (commandFile.settings.permission == undefined || typeof(commandFile.settings.permission) !== "object" ? commandFile.settings.permission : commandFile.settings.permission.command);
            var permissionLevel = await member.permission(discordPermission)

            /**
            * Checks the permissions of a command to see if it is valid for the user to run
            * @param {string} command - The command to check permissions for
            */
            function checkPermission(command) {
                var perms = [
                    "user",
                    "mod",
                    "admin",
                    "owner",
                    "dev"
                ]
                if (commandPermission === "dev") {
                    if (message.author.developer && command === "admin") return true;
                    if (message.author.developer && Permissions.developerOverrides) {
                        return true;
                    } else {
                        onlyDev(commandFile.settings.command);
                        return false;
                    }
                }
                if (typeof(permissionLevel) !== "boolean") {
                    if (permissionLevel >= perms.indexOf(commandPermission)) {
                        return true;
                    } else {
                        switch (commandPermission) {
                            case "owner":
                            wrongUser(message.guild.owner, commandFile.settings.command)
                            return false; 
                            break;

                            case "admin":
                            wrongRole(adminRole, commandFile.settings.command);
                            return false;
                            break;

                            case "mod":
                            wrongRole(moderatorRole, commandFile.settings.command);
                            return false;
                            break;
                        }
                    }
                } else {
                    if (permissionLevel === true) {
                        return true;
                    } else {
                        insufficientPermissions(discordPermission, commandFile.settings.command);
                        return false;
                    }
                }
            }

            /** Runs a command that has been validated and checked for permissions */
            async function runCommand() {
                if (commandPermission === "mod") moderatorCommandExecuted();
                let category;
                for (const [key, value] of client.categories) {
                  if (value.includes(command)) category = key
                }
                if (category === 'nsfw') {
                  if (!message.channel.nsfw) return nsfwCommand(command)
                  const upvotes = await Statistics.zBotUpvotes()
                  if (!upvotes.includes(message.author.id)) return needsUpvote(command)
                }

                if (deleteUserCommand && !message.author.developer) message.delete();
                const Badges = new BadgeStructure(member);
                Badges.incrementProgress("commando")
                if (!message.author.developer) updateCommandTotal()

                try {
                    client.util.log(message.author.tag + " ran " + command)
                    commandFile.run(client, message, args);
                } catch (err) {
                    require('raven').captureException(err);
                    return new zBotError(client, err, message, command).Command()
                }
            }

            if (checkPermission(command)) {
                await runCommand();
            }
        }
    };

    /** Grabs the current count for the commands counter */
    get commands() {
        return commandsUsed;
    }
}
