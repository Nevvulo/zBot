const Experience = require('./../../../structures/user/Experience.js')

module.exports = async function badges(message) {

    /*let member = message.member
    if (!member) member = message.guild.members.fetch(message.author.id);

    const BadgeStructure = new(require('./../../../structures/user/Badges.js'))(member);
    // Developer ✅
    if (message.author.developer && !BadgeStructure.has("developer")) {
        BadgeStructure.add("developer");
    } else if (!message.author.developer && BadgeStructure.has("developer")) {
        BadgeStructure.remove("developer");
    }
    // Moderator ✅
    const isMod = await member.moderator
    if (isMod && !BadgeStructure.has("moderator")) {
        BadgeStructure.add("moderator");
    } else if (!isMod && BadgeStructure.has("moderator")) {
        BadgeStructure.remove("moderator");
    }
    // Friendship - badge progress is handled in hug.js ✅
    if (await BadgeStructure.progress("friendship") >= 10 && !BadgeStructure.has("friendship")) BadgeStructure.add("friendship");
    // Warrior - badge progress is handled in Challenge.js (structure)
    if (await BadgeStructure.progress("warrior") >= 10 && !BadgeStructure.has("warrior")) BadgeStructure.add("warrior");
    // Invictus - badge progress is handled in Challenge.js (structure) (gets reset to 0 on loss)
    if (await BadgeStructure.progress("invictus") >= 5 && !BadgeStructure.has("invictus")) BadgeStructure.add("invictus");
    // Tagger - badge progress is handled in tag.js (set to Tags.count) ✅
    if (await BadgeStructure.progress("tagger") >= 25 && !BadgeStructure.has("tagger")) BadgeStructure.add("tagger");
    // Commando - badge progress is handled in CommandHandler.js (structure) ✅
    if (await BadgeStructure.progress("commando") >= 100 && !BadgeStructure.has("commando")) BadgeStructure.add("commando");
    // Multilingual - badge progress is handled in translate.js ✅
    if (await BadgeStructure.progress("multilingual") >= 50 && !BadgeStructure.has("multilingual")) BadgeStructure.add("multilingual");
    // Essay Writer ✅
    const userLevel = await Experience.getLevel(message.author.id, message.guild.id)
    if (await BadgeStructure.progress("essaywriter") !== userLevel) {
        BadgeStructure.editProgress("essaywriter", userLevel);
    }
    if (await BadgeStructure.progress("essaywriter") >= 10 && !BadgeStructure.has("essaywriter")) {
        BadgeStructure.add("essaywriter");
    } else if (await BadgeStructure.progress("essaywriter") < 10 && BadgeStructure.has("essaywriter")) {
        BadgeStructure.remove("essaywriter");
    }
*/
};