const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const fs = require('fs');
const colors = require('colors');
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite')
const Settings = require('./../general/Settings.js');
const User = require('./../../models/User.js');
const Slots = require('./../../models/Slots.js');
const Badges = require('./../../models/Badges.js');
var talkedRecently = [];

async function newMessage(message) {
if (message.guild == null) return;
const userProfile = await User.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
  if (message.channel.type !== 'text') return;
  if (await Settings.getValue(message.guild, "experienceTracking") == false) return;
  if (message.author.bot) return;
  //✦ Experience handler, including levels, badges and experience gained per message. ✦
  message.guild.members.fetch(message.author).then(async function(member) {
    const filter = message => message.author.id === member.user.id && member.user.bot == false;

        if (!userProfile) {
          User.create({ userID: message.author.id,
                        guildID: message.guild.id,
                        experience: 1,
                        g_experience: 1,
                        background: "default",
                        role: "@everyone",
                        roleColor: "000000",
                        weapon: "wooden" });
          log(colors.magenta("[+] " + message.author.username + " was added to the experience database."), logType.info);
        } else {
          // Checks if they have talked recently
          if (talkedRecently.includes(message.author.id)) {
            return;
          } else {
              let rand = Math.round(Math.random() * (11 - 4) + 4);
              User.increment('experience', { by: rand, where: { userID: message.author.id, guildID: message.guild.id } });
              log("Added " + rand + " experience to " + message.author.username + ".", logType.info);

            // Adds the user to the array so that they can't talk for 65 seconds
            talkedRecently.push(message.author.id);
            client.setTimeout(() => {
              const index = talkedRecently.indexOf(message.author.id);
              // Removes the user from the array after 65 seconds
              talkedRecently.splice(index, 1);
            }, 65000);
          }
        }

      const userBadges = await Badges.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
        if (!userBadges) {
          Badges.create({ userID: message.author.id,
                        guildID: message.guild.id,
                        developer: 0,
                        active: 0,
                        moderator: 0,
                        essaywriter: 0,
                        friendship: 0,
                        photographer: 0 });
        } else {
        // Check if message author is zBlake:
        if (message.author.id == 246574843460321291) {
          Badges.update({ developer: 1 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        }

        // If message author has a moderator role:
        if (message.member.roles.has(await Settings.getValue(message.guild, "moderatorRole"))) {
          Badges.update({ moderator: 1 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        } else {
          Badges.update({ moderator: 0 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        }

        // If message author is one of the names below (active badge):
        if (member.id == 246574843460321291 || member.id == 284551391781978112 || member.id == 184050823326728193 || member.id == 246129294785380353 || member.id == 224472981571633153 || member.id == 213776985581813760 || member.id == 213776985581813760 || member.id == 196792235654774784) { // add id's here if active
          Badges.update({ active: 1 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        }

        //TODO: Add badgeprogress to Postgres
        // If message author has 50/50 on the photographer progress badge:
        sql.get(`SELECT * FROM badgeprogress WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(row => {
        if (row.photographer > 50) {
          Badges.update({ photographer: 1 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        }
        });

        // If message author is lvl 10 or higher:
        if (userProfile.experience > 2500) {
          Badges.update({ developer: 1 }, { where: { userID: message.author.id, guildID: message.guild.id } });
        }

        }

      //SLOTS

      const userSlots = await Slots.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
        if (!userSlots) {
          Slots.create({ userID: message.author.id,
                        guildID: message.guild.id,
                        slot1: "empty",
                        slot2: "empty",
                        slot3: "empty",
                        slot4: "empty",
                        slot5: "empty",
                        slot6: "empty" });
        }

      //BADGEPROGRESS

      sql.get(`SELECT * FROM badgeprogress WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(row => {
        if (!row) {
          sql.run('INSERT INTO badgeprogress (guild, userId, photographer) VALUES (?, ?, ?)', [message.guild.id, message.author.id, 0]);
        }
      sql.get(`SELECT * FROM badgeprogress WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(row => {
      if (message.attachments.size > 0) {
        sql.run(`UPDATE badgeprogress SET photographer = photographer + 1 WHERE userId = ${message.author.id} AND guild = ${message.guild.id}`);
      }
    })
    }).catch(() => {
      console.error;
      sql.run('CREATE TABLE IF NOT EXISTS badgeprogress (guild TEXT, userId TEXT, photographer INTEGER)').then(() => {
        sql.run('INSERT INTO badgeprogress (guild, userId, photographer) VALUES (?, ?, ?)', [message.guild.id, message.author.id, 0]);
      });
    });


  //ROLE MANAGER TODO: role isn't defined before i call it here
  const userProfileRole = await User.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
      if (userProfileRole.role !== message.member.highestRole.name || userProfileRole.roleColor !== message.member.displayHexColor) {
        User.update({ role: message.member.highestRole.name }, { where: { userID: message.author.id, guildID: message.guild.id } });
        User.update({ roleColor: message.member.displayHexColor }, { where: { userID: message.author.id, guildID: message.guild.id } });
      }
  });
}

module.exports = {
    name: "ExperienceManager",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
  }
