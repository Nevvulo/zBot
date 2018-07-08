const fs = require("fs")

module.exports = async function commandLoader(client) {  
    cmdLoader();
    async function cmdLoader() {
      const categories = await fs.readdirSync('./commands');
      categories.forEach(x => {
        loadCategory(x);
      });
    }

    async function loadCategory(name) {
      const files = await fs.readdirSync(`./commands/${name}`);
      const commands = [];
      files.forEach(x => {
        loadCmd(name, x);
        commands.push(x.split('.')[0]);
      });
      client.categories.set(name, commands);
    }

    async function loadCmd(category, cmd) {
      try {
        const command = require(`./../../../commands/${category}/${cmd}`);
        client.commands.set(command.settings.command, command);
        if (!command.settings.aliases) return;
        command.settings.aliases.forEach(alias => {
          client.aliases.set(alias, command.settings.command);
        });
      } catch (err) {
        client.util.log(`An error has occured trying to load command '${cmd.split('.')[0]}'`, "critical");
        client.util.log(err.stack, "critical");
      }
    }
}