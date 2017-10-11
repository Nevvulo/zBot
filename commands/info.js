const Discord = require('discord.js');
const fs = require('fs');
const math = require('mathjs');
var colors = require('colors');
const moment = require('moment');
require('moment-duration-format')
const os = require('os');

exports.run = (client, message, args) => {
var n = Date.now()
var uptime = moment.duration(process.uptime() * 1000, "milliseconds").format('D [days], H [hrs], m [mins], s [secs]')

const memUsed = process.memoryUsage().heapUsed
var parser = math.parser();
    const embed = new Discord.MessageEmbed()
      .setTitle('Discord Support Server')
      .addField('Node Version', "`" + process.version + "`", true)
      .addField('Discord.js Version', "`" + Discord.version + "`", true)
      .addField('Bot Memory Usage', parser.eval(`${memUsed.toFixed()} b to Mb`), true)
      .addField("System Memory Usage", "**Free:** *" + parser.eval(`${os.freemem()} b to Gb`) + `*\n**Total:** *` + parser.eval(`${os.totalmem()} b to Gb`) + "*", true)
      .addField('Process Uptime', uptime, true)
      .addField('Heartbeat Ping', Math.floor(message.client.ping) + 'ms', true)
      .setURL('https://discord.gg/uQWCfXB')
      .setColor("#27ae60")
      .setFooter('zBot - Derived from AstralMod v1, created by zBlake.')
      .setTimestamp()
    message.channel.send({ embed })
}

let command = 'info'
, description = 'View technical information relating to zBot.'
, usage = 'info'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
