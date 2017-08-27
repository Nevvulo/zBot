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


	async function drawStats() {
				message.delete ();

				const Image = Canvas.Image;

				var canvas = new Canvas(310, 275)
				var context = canvas.getContext('2d')

				function roundToPIPScale(number){
				 return Math.round(number * 10000000) / 10000000
				}

				function drawLine(sourceX,sourceY,destnationX,destnationY){
				  context.beginPath();
				  context.moveTo(sourceX, sourceY);
				  context.lineTo(destnationX, destnationY);
				  context.stroke();
				}

				function calcScale(data,boxSize){
				  var result = new Object();
				  result.stepInPixel = boxSize / data.length;


				  var min = Number.POSITIVE_INFINITY;
				  var max = Number.NEGATIVE_INFINITY;
				  for(var i = 0; i < data.length;i++){
				    if(data[i] < min){
				      min = data[i];
				    }
				    if(data[i] > max){
				      max = data[i];
				    }

				  }

				  var delta = max - min;

				  result.offsetY = min;
				  result.multiplicatorY = ((boxSize / delta) / 100) *100;
				  return result;
				}


				function drawGraphAxis(data,boxSize){

				  var labelCount = 10;
				  var stepSize = boxSize / labelCount;

				  var min = Number.POSITIVE_INFINITY;
				  var max = Number.NEGATIVE_INFINITY;
				  for(var i = 0; i < data.length;i++){
				    if(data[i] < min){
				      min = data[i];
				    }
				    if(data[i] > max){
				      max = data[i];
				    }
				  }

				  for(var i = 0; i <= labelCount;i++){

				    var delta = max - min;

				    var currentScale = (1 / labelCount) * i;

				    var label = roundToPIPScale(min + (delta*currentScale));
				    context.fillText( label, boxSize + 5, ((stepSize * i) * -1 ) + boxSize ) ;
				  }
				}

				function drawGraph(data,maxValueCount){

				  context.clearRect(0, 0, canvas.width, canvas.height);
					context.fillStyle="#FFFFFF";
					context.fillRect(0, 0, canvas.width, canvas.height);
					context.fillStyle="#000000"
				  var boxSize = 250;

				  drawLine(0,0,0,boxSize);
				  drawLine(0,0,boxSize,0);
				  drawLine(boxSize,0,boxSize,boxSize);
				  drawLine(0,boxSize,boxSize,boxSize);

				  var scale = calcScale(data,boxSize);

				  var stepInPixel = scale.stepInPixel;
				  var multiplicatorY = scale.multiplicatorY;
				  var offsetY = scale.offsetY;

				  var offset = 0;
				  var lastY = 0;
				  for(var i = 0; i < data.length;i++){
				    var currentY =  ((data[i] * multiplicatorY) * -1) + (offsetY* multiplicatorY)   + boxSize ;
				    if(i == 0){
				      lastY = currentY;
				    }


				    drawLine(offset,lastY,offset+stepInPixel,currentY)
				    offset += stepInPixel;
				    lastY = currentY;

				  }
				  drawGraphAxis(data,boxSize);
				}

					main();

		function main(){
			var chartData = []
				console.log("true")
					var messagesay = 0;
					var argsArray = message.content.split(" ").slice(1);
					var arrayLength = argsArray.length;

					if (arrayLength > 0) {
						for (let i = 0; i < arrayLength; i++) {
							chartData.push(parseFloat(argsArray[i]))
							console.log(chartData)
						}
					} else {
						console.log("false")
						chartData = bot.chartData
						console.log(bot.chartData)
					}
					drawGraph(chartData);
					args = args.toString();

					return message.channel.send({
						files: [{
								attachment: canvas.toBuffer(),
								name: 'stats.png'
							}
						]
					});
	}
}
drawStats();
}

let command = 'graph'
, description = 'Allows you to create custom graphs and plots.'
, usage = 'graph **[information]** (spaces between each new number)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
