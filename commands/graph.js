const Canvas = require('canvas');
const path = require('path');
const bot = require('./../bot.js');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite');

exports.run = (client, message, args) => {
	return message.reply(":large_orange_diamond: **NOPE**: `graph` is undergoing a change behind the scenes. Sorry about this.")
	var elt = document.getElementById('calculator');
	var calculator = Desmos.GraphingCalculator(elt);
	calculator.setExpression({id:'graph1', latex:'y=x^2'});
}

let command = 'graph'
, description = 'Allows you to create custom graphs and plots.'
, usage = 'graph **[information]** (spaces between each new number)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
