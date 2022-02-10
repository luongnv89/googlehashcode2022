const fs = require("fs");
const { quickSort } = require("./algorithms/quickSort");

const { printOutput, processInputFile } = require("./utils");
// GLOBAL VARIABLES
const allClients = [];
const selectedIngredients = [];
let nbPotentialClients = 0;
const allIngredients = {};
const allIngredientNames = [];

class Ingredient {
  constructor(name) {
    this.name = name;
    this.nbLikes = 0;
    this.nbDislikes = 0;
  }

  like() {
    this.nbLikes++;
  }

  dislike() {
    this.nbDislikes++;
  }
}

class Client {
  constructor(nbLikes, likes) {
    this.nbLikes = nbLikes;
    this.likes = likes;
    this.nbDislikes = 0;
    this.dislikes = [];
    this.isSelected = false;
  }

  addDisLikes(nbDislikes, dislikes) {
    this.nbDislikes = nbDislikes;
    this.dislikes = dislikes;
  }
}

/**
 * extract the needed data from an output data
 * @param {Object} data a unit of output data
 */
const outputProcessFct = (data) => {
  return data.split(" ").length;
};

// PROCCESS INPUT FILE
let inputLineIndex = 0;
let currentClientIndex = 0;
let currentClient = null;
/**
 * Process a data line
 * @param {String} line content of a line data
 */
const lineProcessFct = (line) => {
  // console.log('Process line ...', line);
  if (inputLineIndex === 0) {
    // This is the first line
    nbPotentialClients = Number(line.trim());
    // console.log("Number of potential clients: ", nbPotentialClients);
  } else {
    const array = line.split(" ");
    const nbIngredients = Number(array[0]);
    array.splice(0, 1);
    if (inputLineIndex % 2 === 1) {
      // this is the line for liked ingredients
      currentClient = new Client(nbIngredients, array);
      // console.log(`New client ${JSON.stringify(currentClient)}`);
      updateIngredient(array, true);
    } else {
      // this is the line for diskliked ingredients
      currentClient.addDisLikes(nbIngredients, array);
      allClients.push(currentClient);
      currentClient = null;
      updateIngredient(array, false);
    }
  }
  inputLineIndex++;
};

const updateIngredient = (newElements, isLiked) => {
  for (let index = 0; index < newElements.length; index++) {
    if (!allIngredients[newElements[index]]) {
      allIngredients[newElements[index]] = new Ingredient(newElements[index]);
      allIngredientNames.push(newElements[index]);
    }
    if (isLiked) {
      allIngredients[newElements[index]].like();
    } else {
      allIngredients[newElements[index]].dislike();
    }
  }
};

const getRandomIndex = (max) => {
  const rand = Math.random();
  return Math.floor(rand * max);
};

/**
 * Pick a list of random ingredients
 */
const solutionRandomIngredient = () => {
  let randomNumberOfSelectedIngredients = getRandomIndex(
    allIngredientNames.length
  );
  let remainIngredients = [...allIngredientNames];
  while (randomNumberOfSelectedIngredients >= 0) {
    const randomIngredientIndex = getRandomIndex(remainIngredients.length);
    selectedIngredients.push(remainIngredients[randomIngredientIndex]);
    remainIngredients.splice(randomIngredientIndex, 1);
    randomNumberOfSelectedIngredients--;
  }
};

/**
 * Pick a list of random ingredients
 */
const solutionBasedOnLimitOfDislike = (maxDislikes) => {
  for (let index = 0; index < allIngredientNames.length; index++) {
    const ingredients = allIngredients[allIngredientNames[index]];
    if (ingredients.nbDislikes <= maxDislikes) {
      selectedIngredients.push(ingredients.name);
    }
  }
};

const solutionMoreLikesThanDislikes = () => {
  for (let index = 0; index < allIngredientNames.length; index++) {
    const ingredients = allIngredients[allIngredientNames[index]];
    if (
      ingredients.nbDislikes === 0 ||
      ingredients.nbLikes > ingredients.nbDislikes
    ) {
      selectedIngredients.push(ingredients.name);
    }
  }
};

/**
 * Process at the end of the input file
 */
const endProcessFct = () => {
  // console.log("Finish reading input file");
  // console.log("Clients:");
  // console.log("Unsorted:");
  // allClients.map((c) => console.log(JSON.stringify(c)));
  quickSort(allClients, false, "nbLikes");
  // console.log("Sorted:");
  // allClients.map((c) => console.log(JSON.stringify(c)));
  // console.log("Ingredients:");
  const ingredients = Object.values(allIngredients);
  // console.log("Unsorted:");
  // ingredients.map((c) => console.log(JSON.stringify(c)));
  quickSort(ingredients, false, "nbLikes");
  // console.log("Sorted:");
  // ingredients.map((c) => console.log(JSON.stringify(c)));

  // Find a solution
  // solutionRandomIngredient();
  // Only ingredients that no one hate
  // solutionBasedOnLimitOfDislike(0);
  // solutionBasedOnLimitOfDislike(1);
  solutionMoreLikesThanDislikes();
  printOutput(outputPath, selectedIngredients);
};

// START APPLICATION
if (process.argv.length < 3) {
  console.error("MISSING ARGUMENT!");
  process.exit(1);
}
// Parse arguments
// CONFIG INTPUT and OUTPUT
const dataPath = process.argv[2];
const inputArrayPaths = dataPath.split("/");
const outputPath = `${
  inputArrayPaths[inputArrayPaths.length - 1]
}_${Date.now()}.txt`;
console.log("Input data: ", dataPath);
console.log("Output will be at: ", outputPath);
processInputFile(dataPath, lineProcessFct, endProcessFct);
