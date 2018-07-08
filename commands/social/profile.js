exports.settings = {command: "profile", description: "Displays yours or another user's profile.", usage: "profile (user)", throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const Experience = require("./../../structures/user/Experience.js")
	const BadgeStructure = new(require("./../../structures/user/Badges.js"))(message.member)
	const { createCanvas, registerFont, Image } = require("canvas")
	const Find = require("./../../structures/internal/Find.js")
	const request = require("request-promise")
	const {
		promisifyAll
	} = require("tsubaki")
	const fs = promisifyAll(require("fs"))
	const User = require("./../../models/user/User.js")
	const badges = {}
	args = args.slice(0).join(" ") || message.author.id

	const member = Find.member(args, message.guild)[0]
	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to search for. For more information, type \`${await message.guild.prefix}help ${this.settings.command}\`.`)
	if (member.user.bot) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't view profiles of a bot.`)

	const profile = (await member.profile)
	const userSlots = profile.get("inventory").slots
	const badgeLevelArr = []
	for (let i = 0; i < 7; i++) {
		if (userSlots[i] != undefined) {
			badges[userSlots[i]] = {image: null}
			badges[userSlots[i]].image = new Image()
			badges[userSlots[i]].image.src = await fs.readFileAsync(`./assets/profile/badges/${userSlots[i]}.png`)
		}
		const badge = userSlots[i]
		if (badge) {
			badgeLevelArr.push(await BadgeStructure.getLevel(badge))
		}
	}

	if (await member.user.upvoted) {
		badges.upvote = {image: null}
		badges.upvote.image = new Image()
		badges.upvote.image.src = await fs.readFileAsync("./assets/profile/badges/upvote.png")
	}

	if (!!member.user.patron) {
		badges.donator = {image: null}
		badges.donator.image = new Image()
		badges.donator.image.src = await fs.readFileAsync("./assets/profile/badges/patreon.png")
	}

	async function drawStats() {
		const totalExp = await member.experience;
		const level = await Experience.getLevel(member)
		const levelBounds = await Experience.getLevelBounds(level)
		const currentExp = await Experience.getCurrentExperience(member)
		const fillValue = Math.min(Math.max(currentExp / (levelBounds.upperBound - levelBounds.lowerBound), 0), 1)

		registerFont("./assets/profile/fonts/UniSansHeavy.ttf", {family: "Uni Sans CAPS"})
		registerFont("./assets/profile/fonts/Roboto.ttf", {family: "Roboto"})
		registerFont("./assets/profile/fonts/Viga-Regular.otf", {family: "Viga"})

		let color=-25
		function texter(str, x, y){
			for(let i = 0; i <= str.length; ++i){
				const ch = str.charAt(i)
				ctx.font = "16px \"Roboto\""
				ctx.fillStyle = `hsla(${color=color+25%360}, 50%, 50%, 1)`
				ctx.fillText(ch, x, y)
				x += ctx.measureText(ch).width
			}
		}

		const canvas = createCanvas(300, 300)
		const ctx = canvas.getContext("2d")
		const template = new Image()
		const base = new Image()
		const cond = new Image()

		base.src = await fs.readFileAsync(`./assets/profile/backgrounds/${(profile == null ? "default" : profile.get("background"))}.png`)
		template.src = await fs.readFileAsync("./assets/profile/backgrounds/template.png")
		cond.src = await request({
			uri: member.user.displayAvatarURL({ format: "png" }),
			encoding: null
		})

		const generate = async () => {
			// Environment Variables
			ctx.globalAlpha = 1
			ctx.scale(1, 1)
			ctx.patternQuality = "billinear"
			ctx.filter = "bilinear"
			ctx.imageSmoothingEnabled = true
			ctx.antialias = "subpixel"
			ctx.imageSmoothingQuality = "High"
			ctx.shadowColor = "rgba(0, 0, 0, 0.85)"
			ctx.shadowOffsetY = 2
			ctx.shadowBlur = 3
			ctx.drawImage(base, -50, 0, 350, 300)
			ctx.drawImage(template, 0, 0, 300, 300)

			// Username
			if (member.id == 246574843460321291) {
				texter(member.displayName, 75, 35)
			} else if (member.roles.highest.name == "@everyone") {
				ctx.font = "16px \"Roboto\""
				ctx.fillStyle = "#FFF"
				ctx.fillText(member.displayName, 75, 35)
			} else {
				ctx.font = "16px \"Roboto\""
				ctx.fillStyle = member.displayHexColor
				ctx.fillText(member.displayName, 75, 35)
			}

			// Role
			if (member.roles.highest.name == "@everyone") {
				ctx.font = "12px \"Roboto\""
				ctx.fillStyle = "#FFF"
				ctx.fillText("NO ROLE", 75, 50)
			} else {
				ctx.font = "12px \"Roboto\""
				ctx.fillStyle = member.displayHexColor
				ctx.fillText(member.roles.highest.name.toUpperCase(), 75, 50)
			}

			// EXP TITLE
			ctx.font = "22px \"Uni Sans Heavy CAPS\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#E5E5E5"
			ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
			ctx.fillText("EXP.", 74, 152)

			// EXP
			ctx.font = "16px \"Roboto\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#d1d1d1"
			ctx.shadowColor = "rgba(0, 0, 0, 0)"
			ctx.fillText(`${currentExp}/${levelBounds.upperBound - levelBounds.lowerBound}`, 74, 170)

			// EXP
			ctx.font = "10px \"Roboto\""
			ctx.textAlign = "center"
			ctx.fillStyle = "#3498DB"
			ctx.shadowColor = "rgba(0, 0, 0, 0)"
			ctx.fillRect(30, 225, 17, fillValue * -135)

			// LVL
			ctx.font = "22px \"Uni Sans Heavy CAPS\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#E5E5E5"
			ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
			ctx.fillText("LVL.", 74, 97)

			// LVL Number
			ctx.font = "19px \"Roboto\""
			ctx.fillStyle = "#E5E5E5"
			ctx.fillText(`${level}`, 74, 117)

			// TOTAL EXP TITLE
			ctx.font = "22px \"Uni Sans Heavy CAPS\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#E5E5E5"
			ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
			ctx.fillText("TOTAL EXP.", 74, 207)

			// TOTAL EXP
			ctx.font = "16px \"Roboto\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#d1d1d1"
			if (totalExp == "Error.") {
				ctx.fillStyle = "#c1453a"
			}
			ctx.shadowColor = "rgba(0, 0, 0, 0)"
			ctx.fillText(totalExp, 74, 225)

			// BADGES
			// BADGE TITLE
			ctx.font = "15px \"Uni Sans Heavy CAPS\""
			ctx.textAlign = "left"
			ctx.fillStyle = "#E5E5E5"
			ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
			ctx.fillText("Badge Showcase", 25, 255)
			// Badges are spaced out +40 X for each badge
			const slotX = [25, 65, 105, 145, 185, 225]
			let badgesLoaded = 0
			for (let i = 0; i < 7; i++) {
				const badge = userSlots[Number(i)]
				if (badge) {
					badgesLoaded++
					ctx.drawImage(badges[badge].image, slotX[i], 260, 25, 25)
					const badgeLevelColors = ["#43a047", "#fb8c00", "#e53935"]
					if (badgeLevelArr[i] > 0) {
						ctx.fillStyle = badgeLevelColors[badgeLevelArr[i]+1]
						ctx.fillRect(slotX[i], 290, 22, 3)
					}
				}
			}

			if (badgesLoaded < 1) {
				ctx.font = "13px \"Roboto\""
				ctx.textAlign = "left"
				ctx.fillStyle = "#d32f2f"
				ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
				ctx.fillText("There are no badges to display.", 25, 275)
			}

			// Image
			ctx.save()
			ctx.globalAlpha = 1
			ctx.beginPath()
			ctx.arc(40, 40, 25, 0, 2 * Math.PI, true)
			ctx.closePath()
			ctx.clip()
			ctx.shadowBlur = 5
			ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
			ctx.drawImage(cond, 15, 15, 50, 50) // org 15, 15, 50, 50

			ctx.restore()
			if (badges.upvote) {
				ctx.globalAlpha = 1
				ctx.shadowBlur = 3
				ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
				ctx.drawImage(badges.upvote.image, 50, 47, 21, 20)
			}
			if (badges.donator) {
				ctx.globalAlpha = 1
				ctx.shadowBlur = 3
				ctx.shadowColor = "rgba(0, 0, 0, 0.8)"
				ctx.drawImage(badges.donator.image, 50, 47, 21, 20)
			}
		}
		generate()
		
		return message.channel.zend({
			files: [{
				attachment: canvas.toBuffer(),
				name: "profile.png"
			}
			]
		})
	}
	let start = new Date().getTime();
	drawStats()
	client.util.log(`Successfully created canvas for ${this.settings.command} in ${start - message.createdTimestamp}`, "info")
}
