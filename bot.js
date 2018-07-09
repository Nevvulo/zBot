/*

MIT License

Copyright (c) 2018 zBlakee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

const Discord = require("discord.js");
const { Collection } = require("discord.js");
const Database = require("./structures/PostgreSQL");
const api = new (require("./data/main/keys/keys.js"));
const MusicManager = require("./structures/general/Music.js").Manager
const Logger = require("./util/Logger.js")
const LavalinkClient = require("./structures/general/LavalinkClient.js")
const fs = require("fs");
require("./extenders/Guild.js")
require("./extenders/User.js")
require("./extenders/GuildMember.js")
require("./extenders/Message.js")
require("./extenders/TextChannel.js")
require('raven').config(process.argv[2] == "--beta" ? 'https://9e43c53bfe774fc48f0a90ad374af80b@sentry.io/1206971' :
 'https://0a87093a1ab040a59034fcd624b6b8c9@sentry.io/1206947').install();

Database.start();

class Environment {
  constructor(shardCount) {
    this.shardCount = shardCount
    this.shards = []
    this.Shard = null
  }
  init() {
    for (let i=0;i<this.shardCount;i++) {
      this.shards[i] = new Shard(i, this.shardCount)
      this.shards[i].events().login()
    }
  } 
  eval(id, q) { //singular shard
    const client = this.shards[id].client
    let ev;
    try{
      ev = eval(q)
    } catch(e) {
      ev = e.message
    }
    return ev
  }
  broadcastEval(q) { //broadcast eval across all shards
    const results = {results:[]}
    for (const s in this.shards) {
      const client = this.shards[s].client
      let ev;
      try{
        ev = eval(q)
      } catch(e) {
        ev = e.message
      }
      results.results.push(ev)
    }
    results.join = () => { //strings, numbers and other types
      let newResults = 0;
      for (const r of results.results) {
          newResults += r
      }
      return newResults
    }
    return results
  }
}

class Shard extends Environment {
  constructor(shardId, shardCount) {
    super(shardCount)
    this.id = shardId
    this.client = new Discord.Client({
      shardId,
      shardCount,
      "restTimeOffset": 200,
      "disableEveryone": true,
      "messageCacheMaxSize": 100,
      "messageCacheLifetime": 120,
      "messageSweepInterval": 300,
      "disabledEvents": [
        "MESSAGE_REACTION_REMOVE_ALL",
        "USER_NOTE_UPDATE",
        "USER_SETTINGS_UPDATE",
        "TYPING_START",
        "CHANNEL_PINS_UPDATE"
      ],
      "presence": {
        activity: {
          type: 0,
          name: "Discontinuing 20th July"
        }
      }
      });
      this.client.util = {
        emoji: require("./util/Emoji.js"),
        log: Logger
      }
      this.client.error = {
        messages: {
          footer: [],
          description: []
        }
      }
      this.client.music = new (require("./structures/general/Music.js").Manager)(this.client)
  }
  events() {
    const events = [];
    const eventsFolder = "./events";
    fs.readdir(eventsFolder, (err, files) => {
      files.forEach(file => {
        const eventName = file.split(".")[0].charAt(0).toLowerCase() + file.split(".")[0].slice(1);
        try {
          const event = new (require(`${eventsFolder}/${file}`))(this.client);
          events.push(event);
          this.client.on(eventName, (...args) => event.run(...args));
          delete require.cache[require.resolve(`${eventsFolder}/${file}`)];
        } catch (error) {
          Logger(`Error loading ${file} event: ${error.stack}`, "critical");
        }
      });
      Logger(events.length + " events successfully loaded!", "success")
    });
    return this
  }
  login() {
    this.client.login(process.argv[2] == "--beta" ? api.beta : api.token).catch((err) => {
      Logger("zBot failed to establish a connection to the server. " + err, "critical");
    });
    this.client.on("warn", (info) => {
      Logger(info, "warn")
    });
    this.client.on("error", (error) => {
      Logger("[ERROR] " + error, "critical")
    });
  }
}

process.on("unhandledRejection", err => {
  Logger("[UNHANDLED REJECTION] " + (err.stack == undefined ? err : err.stack), "warn");
});
process.on("uncaughtException", err => {
  Logger("[UNCAUGHT EXCEPTION] " + (err.stack == undefined ? err : err.stack), "critical");
  process.exit(1)
});

const env = new Environment(2);
env.init();
module.exports = env;

setInterval(function() {
  const random = ["Discontinuing 20th July", "See zbot.me for more info", "Use +help for more info"]
  env.eval(0, "client").user.setPresence({
    activity: {
      type: 0,
      name: random[Math.floor(Math.random()*3)]
    }
  })
}, 30000)
