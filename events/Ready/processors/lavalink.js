const Settings = require("./../../../structures/general/Settings.js")
const LavalinkClient = require("./../../../structures/general/LavalinkClient.js")

module.exports = async function lavalink(client) {
  let nodes = [
    { "host": '127.0.0.1', "port": 5959, "region": 'eu', "password": "[redacted]" }
  ];
  let regions = {
    eu: ['eu', 'amsterdam', 'frankfurt', 'russia', 'hongkong', 'singapore', 'sydney'],
    us: ['us', 'brazil'],
  };
  client.lavalink = new LavalinkClient(client, nodes, {
    user: client.user.id,
    shards: 1,
    region: 'us',
    rest: {url: 'http://127.0.0.1:2333', password: "[redacted]" }
  });
}
