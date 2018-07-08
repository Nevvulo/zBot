const Timers = require("./../../../structures/general/Timers.js");

async function timer() {
    Timers.pollTimers();
}


module.exports = {
    func: timer,
    interval: 1.5e4
};