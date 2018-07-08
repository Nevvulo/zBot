const Guild = require("./../../../models/guild/Guild.js");

module.exports = async function autorole(guildMember) {
const guild = Guild.findOne({where: {id: guildMember.guild.id}})

//AUTOROLE MANAGER
if (!guild) return;
const guildroles = guild.autoroles
if (guildroles) {
const manageAutorole = guildroles.roles
if (manageAutorole.length > 0) autorole();
function autorole() {
    manageAutorole.map((level, i) => {
    let autoroleObject = manageAutorole[i]
    if (autoroleObject.onJoin) {
        if (autoroleObject.removeOnLevelChange == null) autoroleObject.removeOnLevelChange = false;
        if (!guildMember.guild.roles.has(autoroleObject.role.id)) return;
        if (guildMember.roles.has(autoroleObject.role.id)) return;
        guildMember.roles.add(autoroleObject.role.id);
    }
    });
}
}

}