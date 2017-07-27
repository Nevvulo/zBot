const Discord = require('discord.js');
const fs = require('fs');
var colors = require('colors');
const moment = require('moment');
require('moment-duration-format')

exports.run = (client, message, args) => {
var n = Date.now()
var uptime = moment.duration(process.uptime() * 1000).format('D [days], H [hrs], m [mins], s [secs]')

const memTotal = process.memoryUsage().heapTotal / 1024 / 1024
const memUsed = process.memoryUsage().heapUsed / 1024 / 1024
    const embed = new Discord.RichEmbed()
      .setTitle('GitHub Repository')
      .addField('Node Version', process.version, true)
      .addField('Discord.js Version', Discord.version, true)
      .addField('Memory Usage', memUsed.toFixed(2) + '/' + memTotal.toFixed(2) + 'MB', true)
      .addField('Process Uptime', moment.duration(process.uptime() * 1000).format('D [days], H [hrs], m [mins], s [secs]'), true)
      .addField('Heartbeat Ping', Math.floor(message.client.ping) + 'ms', true)
      .setURL('https://github.com/zBlakee/Xail-Bot')
      .setColor(0x00FF00)
      .setFooter('Xail Bot - Derived from AstralMod, heavily modified by zBlake.')
      .setTimestamp()
    message.channel.send({ embed })
}
