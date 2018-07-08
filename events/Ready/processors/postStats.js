const Statistics = require("./../../../structures/internal/Statistics.js");
const snekfetch = require('snekfetch');

module.exports = async function postStats(client) {
  await Statistics.pollUpvotes();
  snekfetch.post(`https://zbot.me/api/v1/commands`)
  .set('Authorization', api.zbot)
  .send({ commands: [...client.commands] })
  .then(client.util.log('Updated zbot.me commands.', "success"))
  .catch(e => client.util.log('Unable to update zbot.me commands mate. ' + e, "critical"));

  snekfetch.post(`https://zbot.me/api/v1/categories`)
  .set('Authorization', api.zbot)
  .send({ categories: [...client.categories] })
  .then(client.util.log('Updated zbot.me categories.', "success"))
  .catch(e => client.util.log('Unable to update zbot.me categories mate. ' + e, "critical"));
}