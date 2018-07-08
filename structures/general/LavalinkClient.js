const snekfetch = require("snekfetch");
const { PlayerManager } = require("discord.js-lavalink");

class LavalinkClient extends PlayerManager {

    constructor(...args) {
        super(...args);

        this.defaultRegions = {
            asia: ["sydney", "singapore", "japan", "hongkong"],
            eu: ["london", "frankfurt", "amsterdam", "russia", "eu-central", "eu-west"],
            us: ["us-central", "us-west", "us-east", "us-south", "brazil"]
        };
    }

    /**
     * Search for tracks from lavalink rest api
     * @param {string} search Search query
     * @returns {Promise<?Array<Object>>}
     */
    resolveTracks(search) {
        return snekfetch.get(`${this.options.rest.url}/loadtracks`)
            .set("Authorization", this.options.rest.password)
            .query({ identifier: search })
            .then(res => res.body ? res.body : null)
            .catch(error => {
                this.client.util.log(error, "critical");
                return null;
            });
    }

    getIdealRegion(region) {
        region = region.replace("vip-", "");
        for (const key in this.defaultRegions) {
            const nodes = this.nodes.filter(node => node.ready && node.region === key);
            if (!nodes) continue;
            for (const id of this.defaultRegions[key]) {
                if (id === region || region.startsWith(id) || region.includes(id)) return key;
            }
        }
        return this.nodes.first().region;
    }

    getIdealHost(region) {
        region = this.getIdealRegion(region);
        const foundNode = this.nodes.find(node => node.ready && node.region === region);
        return foundNode ? foundNode.host : this.nodes.first().host;
    }

}

module.exports = LavalinkClient;
