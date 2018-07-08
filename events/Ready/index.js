const Settings = require("./../../structures/general/Settings.js")
const processors = require(`${__dirname}/processors`);
const jobs = require(`${__dirname}/jobs`);

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(client) {
      client = this.client
      client.commands = new Map()
      client.categories = new Map()
      client.aliases = new Map()
      client.messages = {characters: 0, total: 0, deleted: 0, edited: 0};
      client.developer = client.users.get('246574843460321291');
      client.contributors = {
        "286166184402092042": "providing hosting for zBot and contributing",
        "278805875978928128": "for providing a codebase for zBot and helping out",
        "236279900728721409": "help with lavalink and optimization",
        "284551391781978112": "support, testing and providing ideas",
        "272689325521502208": "big help with nsfw & music commands"
      }
      client.donators = {
        "246574843460321291": 0
      }

      for (const processor of Object.values(processors)) {
        processor.call(this, client);
      }

      for (const job of jobs) {
        job.func.call(this);
        setInterval(job.func.bind(this), job.interval);
      }

      client.util.log("> zBot is now online!", "success");
    }
};
