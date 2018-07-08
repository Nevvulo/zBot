const processors = require(`${__dirname}/processors`);

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMember, newMember) {
    const client = this.client;
    if (oldMember == newMember) return;
    if (!oldMember || !newMember) return;
    
    for (const processor of Object.values(processors)) {
      processor.call(this, oldMember, newMember);
    }
  }
};
