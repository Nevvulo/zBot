const colors = require("colors");

module.exports = function(logMessage, type = "info") {
  let logString;
  let logFormatting;
  switch (type) {
    case "debug":
      logFormatting = colors.bgMagenta(colors.white("[ DEBUG ]"));
      break;
    case "info":
      logString = colors.white(logMessage);
      logFormatting = colors.white("[ INFO ]");
      break;
    case "warn":
      logString = colors.yellow(logMessage);
      logFormatting = colors.bgYellow(colors.black("[ WARNING ]"));
      break;
    case "critical":
      logString = colors.bgRed(colors.white(logMessage));
      logFormatting = colors.bgRed(colors.white("[ CRITICAL ]"));
      break;
    case "success":
      logString = colors.green(logMessage);
      logFormatting = colors.bgGreen(colors.black("[ SUCCESS ]"));
      break;
    default:
      logString = colors.white(logMessage);
      logFormatting = colors.white("[ INFO ]");
      break;
  }
  console.log(logFormatting, logString);
}
