const fs = require("fs");
const readline = require("readline");

// PRINT OUT THE RESULT
const printOutput = (outputPath, outputs) => {
  if (outputs.length <= 0) {
    console.error("No solution");
    return;
  }
  fs.open(outputPath, "w", (err, fd) => {
    if (err) {
      console.error("ERROR!...");
      return;
    }
    // write header
    fs.writeSync(fd, `${outputs.length}\n`);
    for (let index = 0; index < outputs.length; index++) {
      const currentProject = outputs[index];
      fs.writeSync(fd, `${currentProject.name}\n`);
      fs.writeSync(fd, `${currentProject.contributorNames.join(" ")}\n`);
    }
    fs.closeSync(fd);
  });
};

const processInputFile = (inputFilePath, lineProcessFct, endProcessFct) => {
  // Read input file
  const lineReader = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
  });

  lineReader.on("line", lineProcessFct);
  lineReader.on("close", endProcessFct);
};

module.exports = {
  printOutput,
  processInputFile,
};
