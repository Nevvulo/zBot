const snekfetch = require("snekfetch");

exports.run = (client, message, args) => {
	message.delete();
	var url = args.slice(0).join(' ');
	if (message.attachments.size > 0) {
		let files = message.attachments.map(a => a.attachment)
			url = files.toString()
	} else if (message.attachments.size < 1 && url == "") {
		return message.reply(":no_entry_sign: **ERROR**: I couldn't find any images. Make sure you attach an image to your message, or provide a URL.")
	}

    snekfetch.get(`https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/detect_faces?url=${url}&version=2016-05-20`)
		.set('Accept', "application/json")
		.then(res => {
			var image = JSON.parse(res.text)
			console.log(image.images)
			image = image.images[0]
			message.reply(url + "\n:face_palm: **FACE**: Looking at this image, I estimate that this face belongs to a " + image.faces[0].gender.gender + " who is " + image.faces[0].age.min + " to " + image.faces[0].age.max + " years old.")
    });
};

let command = 'face'
, description = 'Attempts to detect a face in a given image and guesses attributes of that face (age, gender)'
, usage = 'face (url or attach image)'
, throttle = {usages: 4, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
