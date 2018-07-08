const Timers = require("./../../../structures/general/Timers.js");

async function punishment() {
    Timers.pollPunishments();
}


module.exports = {
    func: punishment,
    interval: 6e4
};

