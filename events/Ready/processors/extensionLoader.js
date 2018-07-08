const fs = require("fs")

module.exports = async function extensionLoader(client) {  
  const extentions = [];
  const extenderFolder = "./extenders";
  fs.readdir(extenderFolder, (err, files) => {
    files.map(file => {
      try {
        require(`./../../../${extenderFolder}/${file}`)
        extentions.push(file.split(".")[0]);
      } catch (error) {
        client.util.log(`Error loading ${file} extension: ${error}`, "critical");
      }
    });
    client.util.log(extentions.length + " extentions successfully loaded!", "success")
  });
}