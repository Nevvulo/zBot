exports.settings = {command: "owoify", description: "Translate any text you want into OwO form!", usage: "owoify (text)", aliases: ["owo"], throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const api = new (require("./../../data/main/keys/keys.js"))()
	require('snekfetch').get(`https://dev.anidiots.guide/text/owoify`)
  .set("Authorization", api.idiot)
  .query({ text: args.slice(0).join(" ") })
  .then(res => {
    return message.channel.zend(`${String.fromCharCode(0x200B)}${res.body.text}`) //zws
  }).catch(err => { throw err });
}
