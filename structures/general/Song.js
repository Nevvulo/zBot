class Song {
    constructor(data, requester) {
        Object.defineProperty(this, "data", { value: data });

        this.requester = requester;
        this.track = data.track;
        this.title = data.info.title;
        this.url = data.info.uri;
        this.id = data.info.identifier;
        this.seekable = data.info.isSeekable;
        this.author = data.info.author;
        this.duration = data.info.isStream ? 0 : data.info.length;
        this.stream = data.info.isStream;
        this.position = data.info.position;
        this.skips = new Set();
    }

    toString() {
        return `${this.title} (${this.url})`;
    }

    JSONify() {
        return {
            requester: this.requester ? this.requester.toJSON() : null,
            track: this.track,
            title: this.title,
            url: this.url,
            id: this.id,
            seekable: this.seekable,
            author: this.author,
            duration: this.duration,
            friendlyDuration: this.friendlyDuration,
            stream: this.stream,
            position: this.position
        };
    }

}

module.exports = Song;
