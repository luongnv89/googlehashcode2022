const fs = require("fs");
const { quickSort } = require("./algorithms/quickSort");

const { printOutput, processInputFile } = require("./utils");
// GLOBAL VARIABLES
let nbContributors = 0; // number of contributors
let nbProjects = 0; // number of projects
let allContributors = [];
let allProjects = [];
let assignedProjects = [];

class Skill {
  constructor(name, level) {
    this.name = String(name);
    this.level = Number(level);
  }
}

class Contributor {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.skills = {}; // skills
    this.skillNames = [];
    this.startTime = 0; // time the contributor can start the project
  }
}

class Project {
  constructor(name, duration, score, deadLine) {
    this.name = name;
    this.duration = duration;
    this.score = score;
    this.scorePerDay = Number(score) / Number(duration);
    this.deadLine = deadLine;
    this.roles = {}; // skills
    this.roleNames = [];
    this.contributors = [];
    this.contributorNames = [];
    this.assigned = false;
  }

  assign(c) {
    c.startTime += this.duration;
    this.contributors.push(c);
    this.contributorNames.push(c.name);
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
let currentContributorIndex = 0;
let currentContributorNbSkills = 0;
let currentContributorSkillIndex = 0;
let currentProjectIndex = 0;
let currentProjectNbRoles = 0;
let currentProjectRoleIndex = 0;
let currentState = 0; // 0 - contributor info, 1 - contributor skill, 2 - project info, 3 - project roles
let currentContributor = null;
let currentProject = null;
/**
 * Process a data line
 * @param {String} line content of a line data
 */
const lineProcessFct = (line) => {
  // console.log('Process line ...', line);
  const array = line.split(" ");
  if (inputLineIndex === 0) {
    // This is the first line - total number of project and contributors
    nbContributors = Number(array[0]);
    nbProjects = Number(array[1]);
    // console.log("Number of potential clients: ", nbPotentialClients);
  } else {
    if (currentState === 0) {
      // contributor info - new contributor
      currentContributor = new Contributor(currentContributorIndex, array[0]);
      currentContributorNbSkills = Number(array[1]);
      currentState = 1;
      currentContributorSkillIndex = 0;
    } else if (currentState === 1) {
      // contributor skill
      currentContributor.skills[String(array[0])] = Number(array[1]);
      currentContributor.skillNames.push(String(array[0]));
      currentContributorSkillIndex++;
      if (currentContributorSkillIndex === currentContributorNbSkills) {
        // End of a skill for the current contributor
        currentContributorSkillIndex = 0;
        currentContributorNbSkills = 0;
        allContributors.push(currentContributor);
        currentContributorIndex++;
        if (currentContributorIndex === nbContributors) {
          // end of all contributors
          currentState = 2; // move to project info
        } else {
          // move to next contributors
          currentState = 0;
        }
      }
    } else if (currentState === 2) {
      // project info - new project
      currentProject = new Project(
        array[0], // name
        Number(array[1]), // nb days
        Number(array[2]), // score
        Number(array[3]) // deadLine
      );
      currentProjectRoleIndex = 0;
      currentProjectNbRoles = Number(array[4]); // nbRoles;
      currentState = 3;
    } else if (currentState === 3) {
      // project roles
      currentProject.roles[String(array[0])] = Number(array[1]);
      currentProject.roleNames.push(String(array[0]));
      currentProjectRoleIndex++;
      if (currentProjectRoleIndex === currentProjectNbRoles) {
        // this is end of roles of current project
        allProjects.push(currentProject);
        currentProjectIndex++;
        if (currentProjectIndex === nbProjects) {
          // this is the end
          currentState = 4;
        } else {
          // this is not the last project - move to next project
          currentState = 2;
        }
      }
    } else {
      console.error("Unknown state: ", currentState);
    }
  }
  inputLineIndex++;
};

const solutionProjectHighScore = (startDate = 0) => {
  console.log("startDate: ", startDate);
  let newDate = startDate;
  const remainProjects = allProjects.filter(
    (project) => project.assigned === false
  );
  for (let index = 0; index < remainProjects.length; index++) {
    const currentProject = remainProjects[index];
    if (
      currentProject.duration + startDate >=
      currentProject.deadLine + currentProject.score
    ) {
      // Dont do the project without score
      continue;
    }

    let potentialContributors = [];
    let skills = {};
    for (let index3 = 0; index3 < currentProject.roleNames.length; index3++) {
      const requiredSkill = currentProject.roleNames[index3];
      const requiredSkillLevel = currentProject.roles[requiredSkill];
      let foundContributor = false;
      for (let index2 = 0; index2 < allContributors.length; index2++) {
        const currentContributor = allContributors[index2];
        if (
          currentContributor.startTime <= startDate &&
          (currentContributor.skills[requiredSkill] >= requiredSkillLevel ||
            (skills[requiredSkill] >= requiredSkillLevel &&
              currentContributor.skills[requiredSkill] ===
                requiredSkillLevel - 1)) &&
          potentialContributors.indexOf(currentContributor) === -1
        ) {
          potentialContributors.push(currentContributor);
          foundContributor = true;
          // Update the skill sets
          for (
            let index5 = 0;
            index5 < currentContributor.skillNames.length;
            index5++
          ) {
            const currentSkillName = currentContributor.skillNames[index5];
            if (!skills[currentSkillName]) {
              skills[currentSkillName] =
                currentContributor.skills[currentSkillName];
            } else {
              if (
                skills[currentSkillName] <
                currentContributor.skills[currentSkillName]
              ) {
                skills[currentSkillName] =
                  currentContributor.skills[currentSkillName];
              }
            }
          }
          break;
        }
      }
      if (!foundContributor) {
        // console.log(
        //   "Cannot find any contributor for skill: ",
        //   requiredSkill,
        //   requiredSkillLevel
        // );
        break;
      }
    }

    if (potentialContributors.length === currentProject.roleNames.length) {
      // find all contributors for current project
      for (let index4 = 0; index4 < potentialContributors.length; index4++) {
        currentProject.assign(potentialContributors[index4]);
      }
      assignedProjects.push(currentProject);
      if (newDate < currentProject.duration + startDate)
        newDate = currentProject.duration + startDate;
      currentProject.assigned = true;
    }
  }
  if (newDate > startDate) solutionProjectHighScore(newDate);
};

/**
 * Process at the end of the input file
 */
const endProcessFct = () => {
  console.log("Finish reading input file");
  // console.log("Clients:");
  // console.log("Unsorted:");
  // allClients.map((c) => console.log(JSON.stringify(c)));

  // console.log("Sorted:");
  // allClients.map((c) => console.log(JSON.stringify(c)));
  // console.log("Ingredients:");
  // const ingredients = Object.values(allIngredients);
  // console.log("Unsorted:");
  // ingredients.map((c) => console.log(JSON.stringify(c)));
  // quickSort(ingredients, false, "nbLikes");
  // console.log("Sorted:");
  // ingredients.map((c) => console.log(JSON.stringify(c)));
  // Find a solution
  // quickSort(allProjects, false, "duration");
  // quickSort(allProjects, true, "deadLine");
  quickSort(allProjects, true, "score");
  solutionProjectHighScore();
  // Only ingredients that no one hate
  // solutionBasedOnLimitOfDislike(0);
  // solutionBasedOnLimitOfDislike(1);
  // solutionMoreLikesThanDislikes();
  // solutionBasedOnClientLikes();
  // printOutput(outputPath, selectedIngredients);
  // console.log(allContributors);
  // console.log(allProjects);
  // console.log(assignedProjects);
  printOutput(outputPath, assignedProjects);
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
