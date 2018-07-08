const Weapon = require("./../structures/games/Weapon.js")

exports.zBotAPI = {
  version: 1,
  api: 'https://zbot.me/api',
  cdn: 'https://please.zbot.me'
};

exports.GuildLogObject = {
	message: {
		all: {enabled: false, channels: []},
		modules: {
			edit: {enabled: true, channels: []},
			delete: {enabled: true, channels: []},
			expletive: {enabled: false, channels: []},
			spam: {enabled: false, channels: []}
		}
	},
	member: {
		all: {enabled: false, channels: []},
		modules: {
			join: {enabled: false, channels: []},
			leave: {enabled: false, channels: []}
		}
	},
	moderation: {
		all: {enabled: false, channels: []},
		modules: {
			voice: {enabled: false, channels: []},
			punishments: {enabled: true, channels: []},
			edit_punishments: {enabled: false, channels: []},
			delete_punishments: {enabled: false, channels: []},
			commands: {enabled: false, channels: []},
			member_join: {enabled: false, channels: []},
			member_leave: {enabled: false, channels: []},
			member_update: {enabled: false, channels: []}
		}
	},
	other: {
		enabled: {enabled: false, channels: []},
		modules: {}
	}
};

exports.GuildConfiguration = {
  expletiveFilter: false,
  spamFilter: false,
  moderatorRole: "Moderator",
  muteRole: "Muted",
  prefix: "+",
  experienceTracking: true,
  musicDisplayNowPlaying: false,
  experienceGainMax: 11,
  experienceGainMin: 4,
  deleteUserCommand: true,
  allowMentions: true,
  levelUpMessages: false,
  leaveMessage: "Goodbye!",
  joinMessage: "Hello!",
  punishConfirmation: true,
	dmPunishments: false,
	adminRole: "Administrator",
	djRole: "DJ"
};

exports.GuildConfigurationHidden = [
  "expletiveFilter",
  "spamFilter",
  "experienceGainMin",
  "experienceGainMax",
  "leaveMessage",
  "joinMessage"
];

exports.GuildStructure = {
  autoroles: { roles: [] },
  disable: { commands: [] },
  filter: { words: [] },
  logs: exports.GuildLogObject,
  ignore: { modules: [] },
  autoresponses: { responses: [] }
};

exports.CurrencySettings = {
  name: {
    singular: "zollar",
    plural: "zollars"
  },
  symbol: "ž",
  startingBalance: 100
};

exports.Items = {
  background: {
    waterfall: { id: "waterfall", name: "Waterfall", cost: 300, description: null, type: "background" },
    towncentre: { id: "towncentre", name: "Town Centre", cost: 300, description: null, type: "background" },
    rockside: { id: "rockside", name: "Rockside", cost: 300, description: null, type: "background" },
    stackedrocks: { id: "stackedrocks", name: "Stacked Rocks", cost: 300, description: null, type: "background" },
    road: { id: "road", name: "Road", cost: 300, description: null, type: "background" },
    overheadforest: { id: "overheadforest", name: "Overhead Forest", cost: 300, description: null, type: "background" },
    pizza: { id: "pizza", name: "Pizza", cost: 300, description: null, type: "background" },
    oceansunset: { id: "oceansunset", name: "Ocean Sunset", cost: 300, description: null, type: "background" },
    html: { id: "html", name: "HTML Code", cost: 300, description: null, type: "background" },
    leaves: { id: "leaves", name: "Leaves", cost: 300, description: null, type: "background" },
    minifiedjs: { id: "minifiedjs", name: "JavaScript", cost: 300, description: null, type: "background" },
    gameconsole: { id: "gameconsole", name: "Game Console", cost: 300, description: null, type: "background" },
    gamecontroller: { id: "gamecontroller", name: "Game Controller", cost: 300, description: null, type: "background" },
    garden: { id: "garden", name: "Garden", cost: 300, description: null, type: "background" },
    fox: { id: "fox", name: "Fox", cost: 300, description: null, type: "background" },
    flowerpatch: { id: "flowerpatch", name: "Flower Patch", cost: 300, description: null, type: "background" },
    fantasyclouds: { id: "fantasyclouds", name: "Fantasy Clouds", cost: 300, description: null, type: "background" },
    donuts: { id: "donuts", name: "Donuts", cost: 300, description: null, type: "background" },
    fantasycave: { id: "fantasycave", name: "Fantasy Cave", cost: 300, description: null, type: "background" },
    darkmountain: { id: "darkmountain", name: "Dark Mountain", cost: 300, description: null, type: "background" },
    desk: { id: "desk", name: "Desk", cost: 300, description: null, type: "background" },
    dandelions: { id: "dandelions", name: "Dandelions", cost: 300, description: null, type: "background" },
    city: { id: "city", name: "City", cost: 300, description: null, type: "background" },
    cloudymountain: { id: "cloudymountain", name: "Cloudy Mountain", cost: 300, description: null, type: "background" },
    cave: { id: "cave", name: "Cave", cost: 300, description: null, type: "background" },
    beach: { id: "beach", name: "Beach", cost: 300, description: null, type: "background" },
    castle: { id: "castle", name: "Castle", cost: 300, description: null, type: "background" },
    default: { id: "default", name: "Default", cost: 0, description: null, type: "background" },
    polymountains: { id: "polymountains", name: "Poly Mountains", cost: 300, description: null, type: "background" },
    underwater: { id: "underwater", name: "Underwater", cost: 300, description: null, type: "background" },
    sunset: { id: "sunset", name: "Sunset", cost: 300, description: null, type: "background" },
    space: { id: "space", name: "Space", cost: 300, description: null, type: "background" },
    wolf: { id: "wolf", name: "Wolf", cost: 300, description: null, type: "background" },
    seashells: { id: "seashells", name: "Seashells", cost: 300, description: null, type: "background" },
    flowers: { id: "flowers", name: "Flowers", cost: 300, description: null, type: "background" },
    owl: { id: "owl", name: "Owl", cost: 300, description: null, type: "background" },
    lynx: { id: "lynx", name: "Lynx", cost: 300, description: null, type: "background" },
    puppies: { id: "puppies", name: "Puppies", cost: 300, description: null, type: "background" },
    kitten: { id: "kitten", name: "Kitten", cost: 300, description: null, type: "background" },
    sushi: { id: "sushi", name: "Sushi", cost: 300, description: null, type: "background" },
    potatoes: { id: "potatoes", name: "Potatoes", cost: 300, description: null, type: "background" },
    nerds: { id: "nerds", name: "Nerds", cost: 300, description: null, type: "background" },
    fries: { id: "fries", name: "Fries", cost: 300, description: null, type: "background" },
    marshmellows: { id: "marshmellows", name: "Marshmellows", cost: 300, description: null, type: "background" },
    gummybears: { id: "gummybears", name: "Gummy Bears", cost: 300, description: null, type: "background" },
    fruitloops: { id: "fruitloops", name: "Fruit Loops", cost: 300, description: null, type: "background" },
    coffee: { id: "coffee", name: "Coffee", cost: 300, description: null, type: "background" },
    chocolate: { id: "chocolate", name: "Chocolate", cost: 300, description: null, type: "background" },
    reddragon: { id: "reddragon", name: "Red Dragon", cost: 300, description: null, type: "background" },
    pegasus: { id: "pegasus", name: "Pegasus", cost: 300, description: null, type: "background" },
    shatteredplanet: { id: "shatteredplanet", name: "Shattered Planet", cost: 300, description: null, type: "background" },
    shatteredglass: { id: "shatteredglass", name: "Shattered Glass", cost: 300, description: null, type: "background" },
    piano: { id: "piano", name: "Piano", cost: 300, description: null, type: "background" },
    rainbow: { id: "rainbow", name: "Rainbow", cost: 300, description: null, type: "background" },
    iceglitter: { id: "iceglitter", name: "Ice Glitter", cost: 300, description: null, type: "background" },
    matter: { id: "matter", name: "Matter", cost: 300, description: null, type: "background" },
    swirls: { id: "swirls", name: "Swirls", cost: 300, description: null, type: "background" }
  },
  weapon: {
    wood: { id: Weapon.grabWeapon("wood").type, name: Weapon.grabWeapon("wood").name, cost: 10000, 
    description: Weapon.grabWeapon("wood").description, type: "weapon" },
    stone: { id: Weapon.grabWeapon("stone").type, name: Weapon.grabWeapon("stone").name, cost: 25000, 
    description: Weapon.grabWeapon("stone").description, type: "weapon" },
    steel: { id: Weapon.grabWeapon("steel").type, name: Weapon.grabWeapon("steel").name, cost: 50000, 
    description: Weapon.grabWeapon("steel").description, type: "weapon" },
    diamond: { id: Weapon.grabWeapon("diamond").type, name: Weapon.grabWeapon("diamond").name, cost: 250000, 
    description: Weapon.grabWeapon("diamond").description, type: "weapon" },
    platinum: { id: Weapon.grabWeapon("platinum").type, name: Weapon.grabWeapon("platinum").name, cost: 100000000, 
    description: Weapon.grabWeapon("platinum").description, type: "weapon" },
  },
  badge: generateBadges()
}

function generateBadges() {
  const Badges = new(require("./../structures/user/Badges.js"))();
  let arr = Badges.all;
  let obj = {};
  arr.forEach((o, i) => {
    obj[o.id] = Object.assign(o, {type: "badge", cost: -1});
  });
  return obj;
}