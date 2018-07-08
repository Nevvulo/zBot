const Settings = require("./../../../structures/general/Settings.js")

module.exports = async function vacuum(client) {
  await Settings.storeGuildConfigurations();

  for (let [key, value] of client.guilds) {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await sleep(350);
    await Settings.checkGuild(value);
    await Settings.checkGuildSettings(value);
  }
}