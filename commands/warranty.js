exports.run = (client, message, args) => {
doNotDelete = false;
message.author.send(
	"This program is distributed in the hope that it will be useful,\n" +
	"but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
	"MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
	"GNU General Public License for more details.\n"
);
message.delete();
}

let command = 'warranty'
, description = 'See warranty information related to zBot.'
, usage = '+warranty'
, throttle = {usages: 1, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
