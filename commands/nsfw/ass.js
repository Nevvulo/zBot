exports.settings = {command: "ass", description: "Shows a picture of ass from obutts.ru", usage: "ass", throttle: {usages: 3, duration: 10} }
exports.run = (client, message) => {
	const random = Math.floor(Math.random() * (5600 - 1 + 1)) + 1
	const assid = random.toString().padStart(5, "0")
	const link = `http://media.obutts.ru/butts_preview/${assid}.jpg`
	message.channel.zend(`${client.util.emoji("loading", message.guild)} Here's a random picture of some ass! ${link}`)
}
