const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const Canvas = require('canvas');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
const Settings = require('./Settings.js');

var errorMessage = "";

async function newMessage(message) {
	if (message.guild == null) return;
	var prefix = await Settings.getValue(message.guild, "prefix")
	var moderatorRole = await Settings.getValue(message.guild, "moderatorRole")

  if (message.channel.type !== 'text') return;
  var msg = message.content;

  // Command handler for bot, mod and debug commands.
	if (msg.toLowerCase().startsWith(prefix)) {
	  var command = msg.substr(prefix.length).split(" ").slice(0, 1);
    var args = msg.split(" ").slice(1);

		exports.commandIssuer = message.author.id;


    try {
    			let commandFile = require(`./../../commands/${command}.js`);
    			// ACE prevention
          if (message.author.id == "246574843460321291") return commandFile.run(client, message, args);
          //IF THE COMMAND BEGINS WITH ., / OR ANOTHER OTHER STRANGE STRING, RETURN
    		if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				return message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    		}

				async function runCommand() {
				if (isOwner()) {
					callOwnerCommand();
				} else {
	      	callCommand();
				}


				        function callOwnerCommand() {
				          // If command is an owner command
				          if (!isOwner() && commandFile.settings.permission == "owner") return message.reply(':no_entry_sign: **NOPE:** Only ' + message.guild.owner.displayName + ' can run this command.');
				          if (isOwner()) return commandFile.run(client, message, args);
				        }

				        function callCommand() {
									if (commandFile.settings.permission == "owner" || commandFile.settings.permission == "mod") throw "test"
				          return commandFile.run(client, message, args);
				        }

				        function callModeratorCommand() {
				          // If command is a moderator command
				        if (commandFile.settings.permission == "mod") {
									isModerator().then(moderatorStatus => {
										if (moderatorStatus) {
											commandFile.run(client, message, args);
										} else {
											 message.reply(':no_entry_sign: **NOPE:** What? You\'re not a moderator! Why would you be allowed to type that!?');
										}
									})
								}
				        }

				        function isOwner() {
				          if (message.author.id !== message.guild.ownerID) {
				            return false;
				          } else {
				            return true;
				          }
				        }

								function isModerator() {
				          if (!message.member.roles.has(moderatorRole)) {
				            return false;
				          } else {
				            return true;
				          }
				        }
			}

			runCommand();


			log(message.author.username + " issued command " + command, logType.info);
    		} catch (err) {
    			// ACE prevention
    			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    			}
    				log(err.stack, logType.warning);
            if (err.toString().includes("module")) { return; } else { callError(err, err.stack) }
            async function callError(error, stack) {
            let BSODchance = Math.round(Math.random() * (8 - 1) + 1)
            let errorStack = stack;
            if (BSODchance == 1 || error.toString().includes("--bsod")) {
              var errorM = error.toString().replace("--bsod", "");
              const Image = Canvas.Image;
              var canvas = new Canvas(640, 480)
        			var ctx = canvas.getContext('2d')
        			const base = new Image();

        			const generate = () => {
        				// Environment Variables
        				ctx.drawImage(base, 0, 0, 640, 480);
        				ctx.scale(1, 1);

                ctx.font = '13px Lucida Console';
        				ctx.textAlign = 'left';
        				ctx.fillStyle = '#FFF';
                if (error.stack == undefined) {
                var errFile = "bot.js"
                } else {
                var errFile = error.stack.toString().split("commands\\")[1]
              }

                console.log(errFile)
        				ctx.fillText(errFile.toString().split(":")[0], 436, 66);

                ctx.font = '13px Lucida Console';
        				ctx.textAlign = 'left';
        				ctx.fillStyle = '#FFF';
        				ctx.fillText(errorM, 0, 92);
              };

              base.src = await fs.readFileAsync('./assets/error/bsod.png');
              generate();

              return message.channel.send({
                files: [{
                    attachment: canvas.toBuffer(),
                    name: 'stats.png'
                  }
                ]
              });
            } else {
            await fs.readFile('./data/main/errorHandle/errorMessage.txt', function(err, data){
            if(err) throw err;
            data = data.toString();
            var fileContentLines = data.split( '\n' );
            var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
            var randomLine = fileContentLines[ randomLineIndex ];

            embed = new Discord.MessageEmbed();
            embed.setAuthor("ᴇʀʀᴏʀ »  ");
            embed.setColor("#991400");
            embed.setDescription(":no_entry_sign: " + randomLine)

            var msg = error;
            embed.addField("**Error Content**", msg);

            embed.setFooter("If you see this message whilst trying to use a command, please DM zBlake#6715.")

            message.channel.send({ embed });
          })
          }
          }
          }
    			}
    	}


module.exports = {
    name: "CommandHandler",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
