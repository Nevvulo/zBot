class Find {
    static user(query, preferMember, guild) {
        if (preferMember) {
            let members = Find.member(query, guild)
            if (!guild) throw "Guild not provided"
            if (members.length > 0) return members;
        }

        if (query.startsWith("<@!") && query.endsWith(">")) query = query.substr(3).slice(0, -1);
        if (query.startsWith("<@") && query.endsWith(">")) query = query.substr(2).slice(0, -1);
        let searchResults = [];
        for (const client of require("./../../bot.js").broadcastEval("client").results) {
            for (const user of client.users.values()) {
                if (user.username.toLowerCase() == query.toLowerCase()) {
                    searchResults.unshift(user);
                }
                else if (user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                    searchResults.push(user);
                }
                else if (user.discriminator.toLowerCase() == query.toLowerCase()) {
                    searchResults.push(user);
                }
                else if (user.discriminator.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                    searchResults.push(user);
                }
                else if (user.tag.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                    searchResults.push(user);
                }
                else if (user.tag == query) {
                    searchResults.unshift(user);
                }
                else if (user.id == query) {
                    searchResults.unshift(user);
                }
            }
        }
        return searchResults.reduce((accumulator, current) => {
            if (!accumulator.find(({id}) => id === current.id)) {
              accumulator.push(current);
            }
            return accumulator;
          }, []);
    }

    static member(query, guild) {
        if (query.startsWith("<@!") && query.endsWith(">")) query = query.substr(3).slice(0, -1);
        if (query.startsWith("<@") && query.endsWith(">")) query = query.substr(2).slice(0, -1);
        let searchResults = [];
        for (const guildmember of guild.members.values()) {
            if (guildmember.user.username.toLowerCase() == query.toLowerCase()) {
                searchResults.unshift(guildmember);
            }
            else if (guildmember.user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(guildmember);
            }
            else if (guildmember.user.discriminator.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(guildmember);
            }
            else if (guildmember.user.discriminator.toLowerCase() == query.toLowerCase()) {
                searchResults.unshift(guildmember);
            }
            else if (guildmember.displayName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(guildmember);
            }
            else if (guildmember.displayName.toLowerCase() == query.toLowerCase()) {
                searchResults.push(guildmember);
            }
            else if (guildmember.user.tag.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(guildmember);
            }
            else if (guildmember.user.tag.toLowerCase() == query.toLowerCase()) {
                searchResults.push(guildmember);
            }
            else if (guildmember.id == query) {
                searchResults.unshift(guildmember);
            }
        }
        return searchResults;
    }

    static channel(query, guild) {
        if (query.startsWith("<#") && query.endsWith(">")) query = query.substr(2).slice(0, -1);
        let searchResults = [];
        for (const channel of guild.channels.values()) {
            if (channel.name.toLowerCase() == query.toLowerCase()) {
                searchResults.unshift(channel);
            }
            else if (channel.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(channel);
            }
            else if (channel.id == query) {
                searchResults.unshift(channel);
            }
        }
        return searchResults;
    }

    static role(query, guild) {
        if (query.startsWith("<@&") && query.endsWith(">")) query = query.substr(3).slice(0, -1);
        let searchResults = [];
        for (const role of guild.roles.values()) {
            if (role.name.toLowerCase() == query.toLowerCase()) {
                searchResults.unshift(role);
            }
            else if (role.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                searchResults.push(role);
            }
            else if (role.id == query) {
                searchResults.unshift(role);
            }
        }
        return searchResults;
    }

    static guild(query) {
        let searchResults = [];
        for (const client of require("./../../bot.js").broadcastEval("client").results) {
            for (const guild of client.guilds.values()) {
                if (guild.name.toLowerCase() == query.toLowerCase()) {
                    searchResults.unshift(guild);
                }
                else if (guild.name.toLowerCase().indexOf(query.toLowerCase()) != -1) {
                    searchResults.push(guild);
                }
                else if (guild.id == query) {
                    searchResults.unshift(guild);
                }
            }
        }
        return searchResults.reduce((accumulator, current) => {
            if (!accumulator.find(({id}) => id === current.id)) {
              accumulator.push(current);
            }
            return accumulator;
          }, []);
    }
}

module.exports = Find;
