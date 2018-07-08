const cooldowns = new Map();
const Settings = require('./../../../structures/general/Settings.js');
const Experience = require('./../../../structures/user/Experience.js')
const Badges = require('./../../../structures/user/Badges.js'); 

module.exports = async function experience(message, guild) {
    //COOLDOWN SYSTEM
    if (!cooldowns.has(message.guild.id)) cooldowns.set(message.guild.id, new Map());
    const now = Date.now();
    const timestamps = cooldowns.get(message.guild.id);
    const cooldownAmount = 65000;
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) return;
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //END COOLDOWN

    let isExperience = await Settings.getValue(message.guild, "experienceTracking")
    if (message.guild == null) return;
    if (message.channel.type !== 'text') return;
    if (message.author.bot) return;

    let isIgnored = false;
    if (await Settings.checkIgnore(message.guild, message.channel, "experience")) isIgnored = true;

    //✦ Experience handler, including levels, badges and experience gained per message. ✦
    const filter = message => message.author.id === member.user.id && member.user.bot == false;
    // Checks if they have talked recently

    if (isExperience && !isIgnored) {
        const levelMessages = await Settings.getValue(message.guild, "levelUpMessages");
        let experienceGainMax = await Settings.getValue(message.guild, "experienceGainMax");
        let experienceGainMin = await Settings.getValue(message.guild, "experienceGainMin");
        if (!experienceGainMax) experienceGainMax = 11;
        if (!experienceGainMin) experienceGainMin = 4;

        let member = message.member
        if (!member) member = message.guild.members.fetch(message.author.id);
        let user = (await member.profile)

        const BadgeStructure = new Badges(member);
        BadgeStructure.check();

        const level_before = await Experience.getLevel(message.author.id, message.guild.id)
        let rand = Math.floor(Math.random() * (Number(experienceGainMax) - Number(experienceGainMin) + 1)) + Number(experienceGainMin);
        const experience = Number(user.get("experience"))
        await member.update("experience", Number(experience+rand)) //increment
        const level_after = await Experience.getLevel(message.author.id, message.guild.id)
        if (level_after > level_before) (levelMessages ? function(){
            const experience_to_next = Experience.getLevelBounds(level_after).lowerBound
            return message.channel.zend(message.guild.client.util.emoji("info", message.guild) + " Congratulations **" + message.author.username +
             "**, you leveled up!\n**LEVEL** `" + level_before + "` ─ `" + level_after + "`  |  `" + experience_to_next + "` **EXP** *to next level*")
        }() : "")

        //if (Number(experience)+rand > 99999999999999 || Number(experience) > 99999999999999) await member.update("experience", 99999999999999)
    }

  };