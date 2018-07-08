const snekfetch = require("snekfetch");
const api = new (require("./../../data/main/keys/keys.js"))();
const Settings = require('./Settings.js');
const Song = require("./Song.js");
const moment = require('moment');
const url = require("url");
const { Guild, Collection, Discord } = require('discord.js');
let musicAccount = "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/music.png";

class Music {
    constructor(guild) {
        Object.defineProperty(this, "client", { value: guild.client });
        Object.defineProperty(this, "guild", { value: guild });

        this.textChannel = null;
        this.voiceChannel = null;
        this.queue = [];
        this.playing = false;
        this.paused = false;
        this.repeat = {single: false, queue: false};
        this.currentSong = null;
        this.volume = 100;
    }

    add(songdata, requester) {
        const song = new Song(songdata, requester);
        this.queue.push(song);
        return song;
    }

    join(message) {
        this.client.util.log("Creating new player for guild " + message.guild.name + " (" + message.guild.id + ")")
        this.textChannel = message.channel;
        this.voiceChannel = message.member.voiceChannel;
        this.client.lavalink.join({
            guild: this.guild.id,
            channel: this.voiceChannel.id,
            host: "127.0.0.1"
        }, { selfdeaf: true })
    }

    async play() {
        if (!this.voiceChannel) throw "I am not in a voice channel.";
        if (!this.player) throw "I could not find a connection.";

        const song = this.queue[0];
        this.currentSong = song;
        this.player.play(song.track)
        this.playing = true;
        return this.player;
    }

    pause() {
        if (!this.player) return null;
        this.player.pause();
        this.paused = true;
        return this;
    }

    resume() {
        if (!this.player) return null;
        this.player.resume();
        this.paused = false;
        return this;
    }

    async end(force) {
      this.client.util.log(`"Music ended in ${this.guild.name} via endMusic(), force ${force}`);
      if (this.playing || this.player || force) this.player.stop();
      await this.client.lavalink.leave(this.guild.id);
      this.playing = false;
      return this;
    }

    async destroy() {
        this.queue = null;
        this.playing = null;
        this.textChannel = null;
        this.volume = null;

        await this.end(true);
        this.client.music.delete(this.guild.id);
    }

    async skip(force = true) {
        let queue = this.queue
        const player = await this.player
        if (this.repeat.single || this.repeat.queue) this.add(this.currentSong);
        if (this.queue.length < 1) return this.end()
        if (force && this.player) this.player.stop();
        else this.queue.shift();
        return this;
    }

    async search(query) {
      query = query.replace(/<(.+)>/g, "$1");
      const results = [];
      results.isPlaylist = false;
      if (this.isLink(query)) {
          const linkResults = await this.client.lavalink.resolveTracks(query);
          if (!linkResults) return null;
          for (const result of linkResults) if (result.track) results.push(result);
      } else {
          const searchResults = await this.client.lavalink.resolveTracks(`ytsearch: ${query}`);
          if (!searchResults) return null;
          if (searchResults[0].track) results.push(searchResults[0]);
      }

      if (!results.length) {
          const searchResults = await this.client.lavalink.resolveTracks(`scsearch: ${query}`);
          if (!searchResults) return null;
          if (searchResults[0].track) results.push(searchResults[0]);
      }

      if (results.length > 1) results.isPlaylist = true;
      if (!results.length) throw `Could not find any results for \`${query}\``;
      return results;
    }
    
    isLink(query) {
        const res = url.parse(query);
        return res.protocol && res.hostname;
    }

    prune() {
        this.queue = [];
        return this;
    }

    async DJ(member) {
        //djRole check
        let djRole = await Settings.getValue(member.guild, "djRole")
        return member.roles.has(djRole);
    }

    get player() {
        return this.client.lavalink.get(this.guild.id) || null;
    }
}



class Manager extends Collection {
    constructor(client) {
        super();
        this.client = client;
    }

    add(guild) {
        if (!(guild instanceof Guild)) throw "The parameter 'Guild' must be a guild instance.";
        const music = new Music(guild);
        super.set(guild.id, music);
        return music;
    }
}

module.exports = { Music, Manager };
