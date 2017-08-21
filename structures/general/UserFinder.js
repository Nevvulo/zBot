class UserFinder {

	static getUser(args) {
    var prevArgs = args
    args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

    if (args == "") {
      console.log(args)
      console.log("Args is empty.")
      var foundUsersU = client.users.findAll("username", prevArgs);
      var foundUsersD = client.users.findAll("displayname", prevArgs);
      if (foundUsersU.length > 0) {
        for (let user of foundUsersU) {
          return UserFinder.getUserID(user);
        }
      } else if (foundUsersD.length > 0) {
        for (let user of foundUsersD) {
          return UserFinder.getUserID(user);
        }
      } else {
        throw "I couldn't find a user with that name. Check your spelling, and try again."
      }
  	} else {
      return args;
  	}
	}



    static getUserID(user) {
      var u = user;
      if (user.user != null) {
        u = user.user;
      }
      return u.id;
    }


}

module.exports = UserFinder;
