exports.run = (client, message, args) => {
doNotDelete = false;
message.author.sendMessage(
	"This program is distributed in the hope that it will be useful,\n" +
	"but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
	"MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
	"GNU General Public License for more details.\n"
);
message.delete();
}