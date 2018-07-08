const processors = require(`${__dirname}/processors`);

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guildMember) {
    const client = this.client;
    if (guildMember == guildMember.guild.me) return;
    if (!guildMember) return;
    
    for (const processor of Object.values(processors)) {
      processor.call(this, guildMember);
    }
  }
};
