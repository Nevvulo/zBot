exports.settings = {command: "boobs", description: "Shows a picture of boobs from oboobs.ru", usage: "boobs", throttle: {usages: 3, duration: 10} }
exports.run = (client, message) => {
	const random = Math.floor(Math.random() * (12500 - 1 + 1)) + 1
	const boobid = random.toString().padStart(5, "0")
	const link = `http://media.oboobs.ru/boobs_preview/${boobid}.jpg`
	const word = ["boobs", "breasts", "bazookas", "bongos", "bobs"]
	message.channel.zend(`${client.util.emoji("loading", message.guild)} Here's some ${word[Math.floor(Math.random()*word.length)]}! ${link}`)
}
