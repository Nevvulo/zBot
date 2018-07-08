const Timers = require("./../../../structures/general/Timers.js");
const Statistics = require("./../../../structures/internal/Statistics.js");

async function updateStats(client) {
    Statistics.updateRates()
    if (process.argv[2] !== "--beta") {
        Statistics.sendBotListingData(client)
    }
    await Statistics.zBotUpvotes();
}


module.exports = {
    func: updateStats,
    interval: 1e6
};