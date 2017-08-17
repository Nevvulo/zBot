const Discord = require('discord.js');
const fs = require('fs');
const math = require('mathjs');
var colors = require('colors');
const moment = require('moment');
require('moment-duration-format')
const os = require('os');

exports.run = (client, message, args) => {
var n = Date.now()
var uptime = moment.duration(process.uptime() * 1000).format('D [days], H [hrs], m [mins], s [secs]')

const memTotal = process.memoryUsage().heapTotal / 1024 / 1024
const memUsed = process.memoryUsage().heapUsed / 1024 / 1024
var parser = math.parser();
    const embed = new Discord.MessageEmbed()
      .setTitle('GitHub Repository')
      .addField('Node Version', "`" + process.version + "`", true)
      .addField('Discord.js Version', "`" + Discord.version + "`", true)
      .addField('Bot Memory Usage', memUsed.toFixed() + '/' + memTotal.toFixed() + 'MB', true)
      .addField("System Memory Usage", "**Free:** *" + parser.eval(`${os.freemem()} b to Gb`) + `*\n**Total:** *` + parser.eval(`${os.totalmem()} b to Gb`) + "*", true)
      .addField('Process Uptime', moment.duration(process.uptime() * 1000).format('D [days], H [hrs], m [mins], s [secs]'), true)
      .addField('Heartbeat Ping', Math.floor(message.client.ping) + 'ms', true)
      .setURL('https://github.com/zBlakee/Xail-Bot')
      .setColor(0x00FF00)
      .setFooter('zBot - Derived from AstralMod v1, heavily modified by zBlake.')
      .setTimestamp()
    message.channel.send({ embed })
}
