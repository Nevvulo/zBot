exports.run = (client, message, args) => {
message.delete();
args = args.toString();
args = args.toLowerCase();
if (args == "pumapls") {
	message.reply("Puma is a troll, we all know it, and for some reason Xail tolerates her. End of story.");
} else if (args == "palahace") {
	message.reply("http://image.prntscr.com/image/867e0d4be5574b8786790b831d4e8632.png");
} else if (args == "meg") {
	message.reply("'If you're being camped, you are on your own!'");
} else if (args == "troublesometrio") {
	message.reply("What a beautiful union! https://clips.twitch.tv/xailran/CuriousLyrebirdOptimizePrime");
} else if (args == "youngproteacher") {
	message.reply("A wild British guy appeared. He used Cup of Tea. It was super effective.");
} else if (args == "implicit") {
	message.reply("Part time meme, part time gamer");
} else if (args == "padfoot") {
	message.reply("Harry Potter reference? Random name? Who knows");
} else if (args == "zblake") {
	message.reply("Everything is confusing! Except programming. Programming is cool");
} else if (args == "rocker") {
	message.reply("the most smol of the mods (and cute)");
}
}
