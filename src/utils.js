const fs = require("fs");
const readline = require("readline");

// PRINT OUT THE RESULT
const printOutput = (outputPath, outputs) => {
  fs.open(outputPath, "w", (err, fd) => {
    if (err) {
      console.error("ERROR!...");
      return;
    }
    // write header
    fs.writeSync(fd, `${outputs.length} ${outputs.join(" ")}`);
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
